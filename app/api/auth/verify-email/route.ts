import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export async function GET(req: NextRequest) {
    try {
        const token = req.nextUrl.searchParams.get("token");

        if (!token) {
            return NextResponse.json({ error: "Missing verification token" }, { status: 400 });
        }

        await connectDB();

        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 });
        }

        if (user.isVerified) {
            return NextResponse.json({ message: "Email already verified" });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        return NextResponse.json({ message: "Email verified successfully! You can now log in." });
    } catch (error: unknown) {
        console.error("Verify email error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
