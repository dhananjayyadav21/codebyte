import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Transaction from "@/lib/models/Transaction";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { amount, type = "DEPOSIT" } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        await connectDB();

        if (type === "DEPOSIT") {
            // 1. Update User Balance
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { $inc: { balance: amount } },
                { new: true }
            );

            // 2. Log Transaction
            await Transaction.create({
                userId: user._id,
                type: "DEPOSIT",
                totalAmount: amount,
                symbol: "USD",
                status: "COMPLETED"
            });

            return NextResponse.json({ message: "Deposit successful", balance: updatedUser.balance });
        }

        // Future: Implement Withdraw

        return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 });

    } catch (error) {
        console.error("Wallet error:", error);
        return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
    }
}
