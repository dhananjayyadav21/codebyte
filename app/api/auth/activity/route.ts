import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ActivityLog from "@/lib/models/ActivityLog";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        await connectDB();
        const logs = await ActivityLog.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        return NextResponse.json({ logs });
    } catch (error: unknown) {
        console.error("Activity log error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
