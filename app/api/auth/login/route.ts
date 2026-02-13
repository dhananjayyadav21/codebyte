import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import ActivityLog from "@/lib/models/ActivityLog";
import { verifyPassword, setSessionCookie, isAccountLocked, incrementLoginAttempts, resetLoginAttempts } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const ua = req.headers.get("user-agent") || "unknown";
        const { allowed } = rateLimit(`login:${ip}`, 10, 60_000);
        if (!allowed) {
            return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 });
        }

        const body = await req.json();
        const parsed = loginSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Validation failed", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        await connectDB();

        const user = await User.findOne({ email: parsed.data.email });
        if (!user) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        if (isAccountLocked(user)) {
            return NextResponse.json({ error: "Account is temporarily locked due to too many login attempts. Try again in 15 minutes." }, { status: 423 });
        }

        if (user.isBlocked) {
            return NextResponse.json({ error: "Your account has been suspended. Please contact support." }, { status: 403 });
        }

        if (!user.isVerified) {
            return NextResponse.json({ error: "Please verify your email before logging in." }, { status: 403 });
        }

        const valid = await verifyPassword(parsed.data.password, user.password);
        if (!valid) {
            await incrementLoginAttempts(user._id as string);
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        // Reset attempts on successful login
        await resetLoginAttempts(user._id as string);

        // Update last login
        user.lastLogin = new Date();
        user.lastLoginIP = ip;
        await user.save();

        // Log activity
        await ActivityLog.create({ userId: user._id, action: "login", detail: "User logged in", ip, userAgent: ua });

        // Set session cookie
        await setSessionCookie(
            (user._id as string).toString(),
            user.role,
            parsed.data.remember || false
        );

        return NextResponse.json({
            message: "Login successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: unknown) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
