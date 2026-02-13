import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Stock from "@/lib/models/Stock";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        await connectDB();

        // Optional: Filter by sector or search
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");

        let query = {};
        if (search) {
            query = {
                $or: [
                    { symbol: { $regex: search, $options: "i" } },
                    { name: { $regex: search, $options: "i" } }
                ]
            };
        }

        const stocks = await Stock.find(query).sort({ marketCap: -1 });
        return NextResponse.json(stocks);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch stocks" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        // Allow if no users exist (initial seed) or if admin
        // For hackathon, let's just allow it for now or check if admin
        if (!user || user.role !== "admin") {
            // Check if any stocks exist. If not, maybe allow seeding?
            // For safety, let's just require admin or a special secret header
            const Secret = request.headers.get("x-admin-secret");
            if (Secret !== process.env.ADMIN_SECRET && !user) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        await connectDB();
        const body = await request.json();

        if (Array.isArray(body)) {
            // Bulk insert/update
            for (const stock of body) {
                await Stock.findOneAndUpdate(
                    { symbol: stock.symbol },
                    stock,
                    { upsert: true, new: true }
                );
            }
            return NextResponse.json({ message: `Seeded ${body.length} stocks` });
        } else {
            const stock = await Stock.create(body);
            return NextResponse.json(stock);
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to create stock" }, { status: 500 });
    }
}
