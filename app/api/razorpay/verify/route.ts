
import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Transaction from "@/lib/models/Transaction";
import Notification from "@/lib/models/Notification";

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = body;

        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_secret || !key_id) {
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // Verify Signature
        const generated_signature = crypto
            .createHmac("sha256", key_secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        // Fetch Order to get Currency
        const razorpay = new Razorpay({ key_id, key_secret });
        const order = await razorpay.orders.fetch(razorpay_order_id);

        let amountToAdd = amount;
        let description = `Deposit via Razorpay (ID: ${razorpay_payment_id})`;

        // Handle Currency Conversion (Simplistic for Hackathon: 1 USD = 84 INR)
        // Only convert if the ORDER was in USD but we want to store in INR (implicitly)
        if (order.currency === "USD") {
            const EXCHANGE_RATE = 84;
            amountToAdd = amount * EXCHANGE_RATE;
            description += ` [Converted from $${amount} USD]`;
        }

        // Payment is valid, update wallet
        await connectDB();

        // Add funds to wallet
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $inc: { walletBalance: amountToAdd } },
            { new: true }
        );

        // Record Transaction
        await Transaction.create({
            userId: user._id,
            type: "DEPOSIT",
            amount: amountToAdd,
            status: "success",
            description: description,
            paymentMethod: "razorpay"
        });

        // Send Notification
        await Notification.create({
            userId: user._id,
            type: "system",
            title: "Deposit Successful",
            message: `Successfully deposited ₹${amountToAdd.toFixed(2)} to your wallet.`
        });

        return NextResponse.json({
            success: true,
            message: "Payment verified and wallet updated",
            newBalance: updatedUser.walletBalance
        });

    } catch (error: any) {
        console.error("Razorpay Verify Error:", error);
        return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
    }
}
