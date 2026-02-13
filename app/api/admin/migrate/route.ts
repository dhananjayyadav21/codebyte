import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Stock from "@/lib/models/Stock";
import User from "@/lib/models/User";

export async function GET(request: Request) {
    try {
        await connectDB();

        // 1. Promote FIRST user to admin (for dev/testing)
        const user = await User.findOne({});
        if (user) {
            await User.findByIdAndUpdate(user._id, { role: "admin" });
        }

        // 2. Update all stocks to have default shares if missing
        await Stock.updateMany(
            { totalShares: { $exists: false } },
            { $set: { totalShares: 1000000, availableShares: 1000000 } }
        );

        return NextResponse.json({
            message: "Migration successful.",
            adminUser: user ? user.email : "None found"
        });

    } catch (error) {
        console.error("Migration error:", error);
        return NextResponse.json({ error: "Migration failed" }, { status: 500 });
    }
}
