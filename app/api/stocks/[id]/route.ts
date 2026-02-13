import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Stock from "@/lib/models/Stock";
import Portfolio from "@/lib/models/Portfolio";
import User from "@/lib/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const stock = await Stock.findById(id).lean();
        if (!stock) {
            return NextResponse.json({ error: "Stock not found" }, { status: 404 });
        }

        let userBalance = 0;
        let userShares = 0;

        const user = await getCurrentUser();
        if (user) {
            // Fetch User Balance
            const dbUser = await User.findById(user._id).select("balance");
            if (dbUser) userBalance = dbUser.balance;

            // Fetch Portfolio for this stock
            const portfolio = await Portfolio.findOne({ userId: user._id, stockId: id });
            if (portfolio) userShares = portfolio.shares;
        }

        return NextResponse.json({
            ...stock,
            userBalance,
            userShares
        });

    } catch (error) {
        console.error("Stock fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch stock" }, { status: 500 });
    }
}
