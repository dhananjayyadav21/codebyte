import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

// Admin login
export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const { allowed } = rateLimit(`admin-login:${ip}`, 5, 60_000);
        if (!allowed) {
            return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
        }

        const body = await req.json();
        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Validation failed" }, { status: 400 });
        }

        await connectDB();
        const user = await User.findOne({ email: parsed.data.email, role: "admin" });
        if (!user) {
            return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
        }

        const valid = await verifyPassword(parsed.data.password, user.password);
        if (!valid) {
            return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
        }

        await setSessionCookie((user._id as string).toString(), user.role, false);
        return NextResponse.json({ message: "Admin login successful" });
    } catch (error: unknown) {
        console.error("Admin login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Get all users
export async function GET() {
    try {
        const admin = await getCurrentUser();
        if (!admin || admin.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await connectDB();
        const users = await User.find({})
            .select("-password -verificationToken -resetToken -resetTokenExpiry")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ users });
    } catch (error: unknown) {
        console.error("Admin users error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
