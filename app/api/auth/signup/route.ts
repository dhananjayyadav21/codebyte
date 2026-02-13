import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { hashPassword, generateRandomToken } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { signupSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const { allowed } = rateLimit(`signup:${ip}`, 5, 60_000);
        if (!allowed) {
            return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
        }

        const body = await req.json();
        const parsed = signupSchema.safeParse(body);

        if (!parsed.success) {
            const errors = parsed.error.flatten().fieldErrors;
            return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
        }

        await connectDB();

        const existing = await User.findOne({ email: parsed.data.email });
        if (existing) {
            return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
        }

        const hashedPassword = await hashPassword(parsed.data.password);
        const verificationToken = generateRandomToken();

        await User.create({
            fullName: parsed.data.fullName,
            email: parsed.data.email,
            phone: parsed.data.phone,
            dob: parsed.data.dob,
            address: parsed.data.address,
            bankAccount: parsed.data.bankAccount,
            ifscCode: parsed.data.ifscCode.toUpperCase(),
            pan: parsed.data.pan.toUpperCase(),
            password: hashedPassword,
            verificationToken,
        });

        try {
            await sendVerificationEmail(parsed.data.email, verificationToken);
        } catch {
            // Email sending might fail in dev — user can still verify manually
        }

        return NextResponse.json({
            message: "Account created! Please check your email to verify your account.",
        });
    } catch (error: unknown) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
