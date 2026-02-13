import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { getCurrentUser, hashPassword } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getCurrentUser();
        if (!admin || admin.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();

        await connectDB();
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Toggle verification
        if (body.action === "verify") {
            user.isVerified = true;
            await user.save();
            return NextResponse.json({ message: "User verified" });
        }

        // Toggle block
        if (body.action === "block") {
            user.isBlocked = !user.isBlocked;
            await user.save();
            return NextResponse.json({ message: user.isBlocked ? "User blocked" : "User unblocked" });
        }

        // Reset password
        if (body.action === "reset-password" && body.newPassword) {
            user.password = await hashPassword(body.newPassword);
            user.loginAttempts = 0;
            user.lockUntil = null;
            await user.save();
            return NextResponse.json({ message: "Password reset successfully" });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: unknown) {
        console.error("Admin user action error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
