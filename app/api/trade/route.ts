import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Stock from "@/lib/models/Stock";
import Transaction from "@/lib/models/Transaction";
import Portfolio from "@/lib/models/Portfolio";
import { getCurrentUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { stockId, type, amount, quantity } = body;
        // Logic: 
        // If type="BUY", input might be 'amount' (cash) or 'quantity' (shares). 
        //   - Limit by User Balance.
        // If type="SELL", input usually 'quantity' (shares).
        //   - Limit by Portfolio Holdings.

        if (!stockId || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        // Start Session for Transaction
        // Note: Transactions require MongoDB Replica Set. If creating standalone, this might fail.
        // For simplicity in hackathon, we'll try-catch or just do sequential updates without transaction if it fails.
        // We will do robust sequential updates with checks.

        const stock = await Stock.findById(stockId);
        if (!stock) {
            return NextResponse.json({ error: "Stock not found" }, { status: 404 });
        }

        const currentPrice = stock.price;
        let sharesToTrade = 0;
        let totalCost = 0;

        if (quantity) {
            sharesToTrade = Number(quantity);
            totalCost = sharesToTrade * currentPrice;
        } else if (amount) {
            totalCost = Number(amount);
            sharesToTrade = totalCost / currentPrice;
        } else {
            return NextResponse.json({ error: "Specify amount or quantity" }, { status: 400 });
        }

        if (sharesToTrade <= 0 || totalCost <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        // --- BUY LOGIC ---
        if (type === "BUY") {
            // 1. Check Balance
            if (user.balance < totalCost) {
                return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
            }

            // 2. Deduct Balance
            user.balance -= totalCost;
            await User.findByIdAndUpdate(user._id, { balance: user.balance });

            // 3. Update Portfolio
            const portfolio = await Portfolio.findOne({ userId: user._id, stockId: stock._id });
            if (portfolio) {
                // Update average price
                // New Avg = ((OldShares * OldAvg) + (NewShares * NewPrice)) / TotalShares
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

            // 4. Record Transaction
            await Transaction.create({
                userId: user._id,
                stockId: stock._id,
                symbol: stock.symbol,
                type: "BUY",
                shares: sharesToTrade,
                price: currentPrice,
                totalAmount: totalCost
            });

            return NextResponse.json({ message: "Buy successful", shares: sharesToTrade, price: currentPrice });
        }

        // --- SELL LOGIC ---
        if (type === "SELL") {
            const portfolio = await Portfolio.findOne({ userId: user._id, stockId: stock._id });
            if (!portfolio || portfolio.shares < sharesToTrade) {
                return NextResponse.json({ error: "Insufficient shares" }, { status: 400 });
            }

            // 1. Add Balance
            // Note: You can sell even if it's less than what you paid. balance increases by current market value.
            user.balance += totalCost;
            await User.findByIdAndUpdate(user._id, { balance: user.balance });

            // 2. Update Portfolio
            portfolio.shares -= sharesToTrade;
            // We don't change average buy price when selling, usually.

            if (portfolio.shares <= 0.000001) { // Floating point safety
                await Portfolio.findByIdAndDelete(portfolio._id);
            } else {
                await portfolio.save();
            }

            // 3. Record Transaction
            await Transaction.create({
                userId: user._id,
                stockId: stock._id,
                symbol: stock.symbol,
                type: "SELL",
                shares: sharesToTrade,
                price: currentPrice,
                totalAmount: totalCost
            });

            return NextResponse.json({ message: "Sell successful", shares: sharesToTrade, price: currentPrice });
        }

        return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
    }
}
