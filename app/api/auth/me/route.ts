import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        console.log(`[Auth] User ${user.email} fetched. Balance: ${user.balance}`);

        return NextResponse.json({ user });
    } catch (error: unknown) {
        console.error("Get user error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
