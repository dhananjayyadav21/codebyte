import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import ActivityLog from "@/lib/models/ActivityLog";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { profileUpdateSchema, changePasswordSchema } from "@/lib/validation";
import { sendAccountUpdateNotification } from "@/lib/email";

export async function PUT(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const body = await req.json();
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const ua = req.headers.get("user-agent") || "unknown";

        // Password change
        if (body.currentPassword) {
            const parsed = changePasswordSchema.safeParse(body);
            if (!parsed.success) {
                return NextResponse.json({ error: "Validation failed", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
            }

            await connectDB();
            const fullUser = await User.findById(user._id);
            if (!fullUser) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            const valid = await verifyPassword(parsed.data.currentPassword, fullUser.password);
            if (!valid) {
                return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
            }

            fullUser.password = await hashPassword(parsed.data.newPassword);
            await fullUser.save();

            await ActivityLog.create({ userId: user._id, action: "password_change", detail: "Password changed", ip, userAgent: ua });

            try {
                await sendAccountUpdateNotification(fullUser.email, "Your password was changed");
            } catch { }

            return NextResponse.json({ message: "Password changed successfully" });
        }

        // Profile update
        const parsed = profileUpdateSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Validation failed", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        await connectDB();
        const updated = await User.findByIdAndUpdate(
            user._id,
            { $set: parsed.data },
            { new: true }
        ).select("-password -verificationToken -resetToken -resetTokenExpiry");

        await ActivityLog.create({ userId: user._id, action: "profile_update", detail: `Updated: ${Object.keys(parsed.data).join(", ")}`, ip, userAgent: ua });

        try {
            await sendAccountUpdateNotification(updated!.email, `Profile updated: ${Object.keys(parsed.data).join(", ")}`);
        } catch { }

        return NextResponse.json({ message: "Profile updated", user: updated });
    } catch (error: unknown) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
