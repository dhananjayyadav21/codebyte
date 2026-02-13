import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { hashPassword } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = resetPasswordSchema.safeParse(body);

        if (!parsed.success) {
            const errors = parsed.error.flatten().fieldErrors;
            return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
        }

        await connectDB();

        const user = await User.findOne({
            resetToken: parsed.data.token,
            resetTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
        }

        user.password = await hashPassword(parsed.data.password);
        user.resetToken = null;
        user.resetTokenExpiry = null;
        user.loginAttempts = 0;
        user.lockUntil = null;
        await user.save();

        return NextResponse.json({ message: "Password reset successfully! You can now log in." });
    } catch (error: unknown) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
