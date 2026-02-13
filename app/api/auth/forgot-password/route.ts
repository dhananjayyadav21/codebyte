import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { generateRandomToken } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { forgotPasswordSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const { allowed } = rateLimit(`forgot:${ip}`, 3, 60_000);
        if (!allowed) {
            return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
        }

        const body = await req.json();
        const parsed = forgotPasswordSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
        }

        await connectDB();
        const user = await User.findOne({ email: parsed.data.email });

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
        }

        const resetToken = generateRandomToken();
        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        try {
            await sendPasswordResetEmail(user.email, resetToken);
        } catch {
            // Fail silently
        }

        return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    } catch (error: unknown) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
