import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Stock from "@/lib/models/Stock";
import { verifyAdmin } from "@/lib/admin"; // We need to export verifyAdmin from lib/admin

export async function POST(request: Request) {
    try {
        const adminCheck = await verifyAdmin();
        if (!adminCheck) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        const body = await request.json();

        await connectDB();

        // Ensure symbol is uppercase
        if (body.symbol) body.symbol = body.symbol.toUpperCase();

        const newStock = await Stock.create({
            ...body,
            availableShares: body.totalShares // Initially available = total
        });

        return NextResponse.json(newStock, { status: 201 });

    } catch (error: any) {
        console.error("Create Stock Error:", error);
        return NextResponse.json({ error: error.message || "Failed to create stock" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const adminCheck = await verifyAdmin();
        if (!adminCheck) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        const body = await request.json();
        const { _id, ...updateData } = body;

        if (!_id) return NextResponse.json({ error: "Missing Stock ID" }, { status: 400 });

        await connectDB();

        // Logic to update availableShares if totalShares changes?
        // For simplicity, we assume admin manages this correctly or we handle delta.
        // Getting current stock to calc delta
        if (updateData.totalShares) {
            const currentStock = await Stock.findById(_id);
            if (currentStock) {
                const diff = updateData.totalShares - currentStock.totalShares;
                updateData.availableShares = currentStock.availableShares + diff;
            }
        }

        const updatedStock = await Stock.findByIdAndUpdate(_id, updateData, { new: true });

        return NextResponse.json(updatedStock);

    } catch (error: any) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const adminCheck = await verifyAdmin();
        if (!adminCheck) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        await connectDB();
        await Stock.findByIdAndDelete(id);

        return NextResponse.json({ message: "Stock deleted" });

    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
