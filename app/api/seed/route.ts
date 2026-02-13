import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Stock from "@/lib/models/Stock";
import { stocks } from "@/lib/mock-data";

export async function GET() {
    try {
        await connectDB();

        const count = await Stock.countDocuments();
        if (count > 0) {
            return NextResponse.json({ message: "Database already seeded", count });
        }

        const stocksToInsert = stocks.map(s => {
            // Removing ID to let MongoDB generate _id
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...rest } = s;
            return rest;
        });

        await Stock.insertMany(stocksToInsert);

        return NextResponse.json({ message: `Successfully seeded ${stocksToInsert.length} stocks` });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: "Seeding failed", details: error }, { status: 500 });
    }
}
