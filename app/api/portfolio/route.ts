import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Portfolio from "@/lib/models/Portfolio";
import Stock from "@/lib/models/Stock";
import Transaction from "@/lib/models/Transaction";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // 1. Get User Balance (Ensure it's a number)
        const dbUser = await User.findById(user._id).select("balance");
        const balance = dbUser?.balance || 0; // Fix NaN issue

        // 2. Get Portfolio Items
        const portfolioItems = await Portfolio.find({ userId: user._id }).lean();

        let totalInvested = 0;
        let currentValue = 0;

        const enrichedPortfolio = await Promise.all(portfolioItems.map(async (item) => {
            const stock = await Stock.findById(item.stockId).select("name price symbol change changePercent").lean();
            if (!stock) return null;

            const value = item.shares * stock.price;
            const invested = item.shares * item.averageBuyPrice;

            totalInvested += invested;
            currentValue += value;

            return {
                stockId: item.stockId,
                symbol: stock.symbol,
                stockName: stock.name,
                shares: item.shares,
                averageBuyPrice: item.averageBuyPrice,
                currentPrice: stock.price,
                currentValue: value,
                gainLoss: value - invested,
                gainLossPercent: invested > 0 ? ((value - invested) / invested) * 100 : 0
            };
        }));

        // Filter out nulls (deleted stocks)
        const validPortfolio = enrichedPortfolio.filter(item => item !== null);

        // 3. Get Recent Activity
        const transactions = await Transaction.find({ userId: user._id })
            .sort({ date: -1 })
            .limit(10)
            .lean();

        const totalGainLoss = currentValue - totalInvested;

        return NextResponse.json({
            balance,
            totalInvested,
            currentValue,
            totalGainLoss,
            portfolio: validPortfolio,
            recentActivity: transactions
        });

    } catch (error) {
        console.error("Portfolio fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
    }
}
