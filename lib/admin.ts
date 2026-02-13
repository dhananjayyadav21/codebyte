import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function verifyAdmin() {
    const user = await getCurrentUser();

    if (!user) {
        return null; // Not logged in
    }

    if (user.role !== "admin") {
        return false; // Logged in but not admin
    }

    return user; // Return admin user
}

export function unauthorizedResponse() {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
}
