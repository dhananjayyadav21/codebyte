import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
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

        // 1. Fetch Portfolio
        const portfolioItems = await Portfolio.find({ userId: user._id }).lean();

        // 2. Fetch Latest Stock Prices to calculate current value
        const stockIds = portfolioItems.map(p => p.stockId);
        const stocks = await Stock.find({ _id: { $in: stockIds } }).lean();

        const stockMap = new Map(stocks.map(s => [s._id.toString(), s]));

        // 3. Calculate Portfolio Value & Stats
        let totalInvested = 0;
        let currentValue = 0;

        const holdings = portfolioItems.map(item => {
            const stock = stockMap.get(item.stockId.toString());
            const currentPrice = stock ? stock.price : item.averageBuyPrice; // Fallback

            const invested = item.shares * item.averageBuyPrice;
            const current = item.shares * currentPrice;

            totalInvested += invested;
            currentValue += current;

            return {
                ...item,
                stockName: stock?.name || "Unknown",
                currentPrice,
                currentValue: current,
                gainLoss: current - invested,
                gainLossPercent: invested > 0 ? ((current - invested) / invested) * 100 : 0
            };
        });

        // 4. Fetch Recent Transactions
        const transactions = await Transaction.find({ userId: user._id })
            .sort({ date: -1 })
            .limit(10)
            .lean();

        return NextResponse.json({
            balance: user.balance,
            totalInvested,
            currentValue,
            totalGainLoss: currentValue - totalInvested,
            portfolio: holdings,
            recentActivity: transactions
        });

    } catch (error) {
        console.error("Portfolio fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
    }
}
