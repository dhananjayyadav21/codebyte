import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Stock from "@/lib/models/Stock";
import Transaction from "@/lib/models/Transaction";
import Portfolio from "@/lib/models/Portfolio";
import Notification from "@/lib/models/Notification";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { stockId, type, amount } = body;

        if (!stockId || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        const stock = await Stock.findById(stockId);
        if (!stock) {
            return NextResponse.json({ error: "Stock not found" }, { status: 404 });
        }

        const currentPrice = stock.price;
        let sharesToTrade = 0;
        let totalCost = 0;

        // Calculate shares/cost
        if (amount) {
            totalCost = Number(amount);
            sharesToTrade = totalCost / currentPrice;
        } else {
            return NextResponse.json({ error: "Specify amount" }, { status: 400 });
        }

        if (sharesToTrade <= 0 || totalCost <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        // --- BUY LOGIC ---
        if (type === "BUY") {
            // 1. Check User Balance
            if (user.balance < totalCost) {
                return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
            }

            // 2. Check Inventory (Admin Limit)
            if (stock.availableShares < sharesToTrade) {
                return NextResponse.json({
                    error: `Only ${stock.availableShares.toFixed(4)} shares available`
                }, { status: 400 });
            }

            // 3. Update User Balance
            user.balance -= totalCost;
            await User.findByIdAndUpdate(user._id, { balance: user.balance });

            // 4. Update Stock Inventory
            stock.availableShares -= sharesToTrade;
            await stock.save();

            // 5. Update Portfolio
            const portfolio = await Portfolio.findOne({ userId: user._id, stockId: stock._id });
            if (portfolio) {
                const totalShares = portfolio.shares + sharesToTrade;
                const newAvg = ((portfolio.shares * portfolio.averageBuyPrice) + totalCost) / totalShares;

                portfolio.shares = totalShares;
                portfolio.averageBuyPrice = newAvg;
                await portfolio.save();
            } else {
                await Portfolio.create({
                    userId: user._id,
                    stockId: stock._id,
                    symbol: stock.symbol,
                    shares: sharesToTrade,
                    averageBuyPrice: currentPrice
                });
            }

            // 6. Log Transaction
            await Transaction.create({
                userId: user._id,
                stockId: stock._id,
                symbol: stock.symbol,
                type: "BUY",
                shares: sharesToTrade,
                price: currentPrice,
                totalAmount: totalCost,
                status: "COMPLETED"
            });

            // 7. Send Notification
            await Notification.create({
                userId: user._id,
                type: "trade",
                title: "Buy Order Executed",
                message: `You successfully bought ${sharesToTrade.toFixed(4)} shares of ${stock.symbol} for $${totalCost.toFixed(2)}.`
            });

            return NextResponse.json({ message: "Buy successful", shares: sharesToTrade, price: currentPrice });
        }

        // --- SELL LOGIC ---
        if (type === "SELL") {
            const portfolio = await Portfolio.findOne({ userId: user._id, stockId: stock._id });
            if (!portfolio || portfolio.shares < sharesToTrade) {
                return NextResponse.json({ error: "Insufficient shares" }, { status: 400 });
            }

            // 1. Update User Balance
            user.balance += totalCost;
            await User.findByIdAndUpdate(user._id, { balance: user.balance });

            // 2. Update Stock Inventory (Return shares to pool)
            stock.availableShares += sharesToTrade;
            await stock.save();

            // 3. Update Portfolio
            portfolio.shares -= sharesToTrade;

            if (portfolio.shares <= 0.000001) {
                await Portfolio.findByIdAndDelete(portfolio._id);
            } else {
                await portfolio.save();
            }

            // 4. Log Transaction
            await Transaction.create({
                userId: user._id,
                stockId: stock._id,
                symbol: stock.symbol,
                type: "SELL",
                shares: sharesToTrade,
                price: currentPrice,
                totalAmount: totalCost,
                status: "COMPLETED"
            });

            // 5. Send Notification
            await Notification.create({
                userId: user._id,
                type: "trade",
                title: "Sell Order Executed",
                message: `You successfully sold ${sharesToTrade.toFixed(4)} shares of ${stock.symbol} for $${totalCost.toFixed(2)}.`
            });

            return NextResponse.json({ message: "Sell successful", shares: sharesToTrade, price: currentPrice });
        }

        return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
    }
}
