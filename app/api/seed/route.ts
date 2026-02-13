import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Stock from "@/lib/models/Stock";
import Transaction from "@/lib/models/Transaction";
import Portfolio from "@/lib/models/Portfolio";
import { hashPassword } from "@/lib/auth";

export async function POST() {
    try {
        await connectDB();

        const adminEmail = process.env.ADMIN_EMAIL || "admin@stakewise.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

        // ── 1. Create or find Admin User ──────────────────────
        let adminUser = await User.findOne({ email: adminEmail });

        if (!adminUser) {
            const hashed = await hashPassword(adminPassword);
            adminUser = await User.create({
                fullName: "StakeWise Admin",
                email: adminEmail,
                password: hashed,
                phone: "0000000000",
                dob: "1990-01-01",
                address: "StakeWise HQ",
                bankAccount: "0000000000",
                ifscCode: "SBIN0000001",
                pan: "ADMIN0000A",
                role: "admin",
                isVerified: true,
                balance: 50000,
            });
        } else {
            // Ensure role is admin
            if (adminUser.role !== "admin") {
                adminUser.role = "admin";
                await adminUser.save();
            }
        }

        // ── 2. Get all stocks for seeding trades ──────────────
        const stocks = await Stock.find({}).lean();
        if (stocks.length === 0) {
            return NextResponse.json({ error: "No stocks found. Seed stocks first." }, { status: 400 });
        }

        // ── 3. Seed sample deposit transactions for admin ─────
        const existingTx = await Transaction.countDocuments({ userId: adminUser._id });
        if (existingTx === 0) {
            const now = new Date();

            // Deposit history
            const deposits = [
                { amount: 25000, daysAgo: 30 },
                { amount: 15000, daysAgo: 20 },
                { amount: 10000, daysAgo: 10 },
            ];

            for (const dep of deposits) {
                const date = new Date(now);
                date.setDate(date.getDate() - dep.daysAgo);

                await Transaction.create({
                    userId: adminUser._id,
                    type: "DEPOSIT",
                    totalAmount: dep.amount,
                    symbol: "USD",
                    status: "COMPLETED",
                    date,
                });
            }

            // ── 4. Seed sample trades (BUY) ───────────────────
            const tradesToSeed = [
                { symbolIdx: 0, amount: 5000, daysAgo: 25 },  // AAPL
                { symbolIdx: 1, amount: 3000, daysAgo: 22 },  // MSFT
                { symbolIdx: 4, amount: 8000, daysAgo: 18 },  // NVDA
                { symbolIdx: 2, amount: 2000, daysAgo: 15 },  // AMZN
                { symbolIdx: 3, amount: 1500, daysAgo: 12 },  // GOOGL
                { symbolIdx: 5, amount: 4000, daysAgo: 8 },   // META
                { symbolIdx: 0, amount: 2500, daysAgo: 5 },   // AAPL (more)
                { symbolIdx: 6, amount: 1000, daysAgo: 3 },   // TSLA
            ];

            // Some sell trades too
            const sellTrades = [
                { symbolIdx: 1, amount: 1000, daysAgo: 10 }, // Sold some MSFT
                { symbolIdx: 4, amount: 2000, daysAgo: 6 },  // Sold some NVDA
            ];

            for (const trade of tradesToSeed) {
                if (trade.symbolIdx >= stocks.length) continue;
                const stock = stocks[trade.symbolIdx];
                const shares = trade.amount / stock.price;
                const date = new Date(now);
                date.setDate(date.getDate() - trade.daysAgo);

                await Transaction.create({
                    userId: adminUser._id,
                    stockId: stock._id,
                    symbol: stock.symbol,
                    type: "BUY",
                    shares,
                    price: stock.price,
                    totalAmount: trade.amount,
                    status: "COMPLETED",
                    date,
                });

                // Update or create portfolio
                const existing = await Portfolio.findOne({
                    userId: adminUser._id,
                    stockId: stock._id,
                });

                if (existing) {
                    const totalCost = existing.averageBuyPrice * existing.shares + trade.amount;
                    existing.shares += shares;
                    existing.averageBuyPrice = totalCost / existing.shares;
                    await existing.save();
                } else {
                    await Portfolio.create({
                        userId: adminUser._id,
                        stockId: stock._id,
                        symbol: stock.symbol,
                        shares,
                        averageBuyPrice: stock.price,
                    });
                }

                // Update stock inventory
                await Stock.findByIdAndUpdate(stock._id, {
                    $inc: { availableShares: -shares },
                });
            }

            // Process sell trades
            for (const trade of sellTrades) {
                if (trade.symbolIdx >= stocks.length) continue;
                const stock = stocks[trade.symbolIdx];
                const shares = trade.amount / stock.price;
                const date = new Date(now);
                date.setDate(date.getDate() - trade.daysAgo);

                await Transaction.create({
                    userId: adminUser._id,
                    stockId: stock._id,
                    symbol: stock.symbol,
                    type: "SELL",
                    shares,
                    price: stock.price,
                    totalAmount: trade.amount,
                    status: "COMPLETED",
                    date,
                });

                // Update portfolio
                const portfolio = await Portfolio.findOne({
                    userId: adminUser._id,
                    stockId: stock._id,
                });

                if (portfolio) {
                    portfolio.shares -= shares;
                    if (portfolio.shares <= 0) {
                        await portfolio.deleteOne();
                    } else {
                        await portfolio.save();
                    }
                }

                // Return shares to pool
                await Stock.findByIdAndUpdate(stock._id, {
                    $inc: { availableShares: shares },
                });

                // Admin got the money
                await User.findByIdAndUpdate(adminUser._id, {
                    $inc: { balance: trade.amount },
                });
            }

            // Deduct bought amounts from admin balance
            const totalBought = tradesToSeed.reduce((sum, t) => sum + t.amount, 0);
            await User.findByIdAndUpdate(adminUser._id, {
                $inc: { balance: -totalBought },
            });
        }

        return NextResponse.json({
            message: "Seed complete!",
            admin: {
                email: adminEmail,
                password: adminPassword,
            },
            tradesSeeded: existingTx === 0,
        });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: "Seed failed" }, { status: 500 });
    }
}
