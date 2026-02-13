import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { cookies } from "next/headers";
import { connectDB } from "./db";
import User from "./models/User";

const JWT_SECRET = process.env.JWT_SECRET || "stakewise-dev-secret-change-me";
const COOKIE_NAME = "stakewise_token";

// ── Password ────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// ── JWT ─────────────────────────────────────────────────
export function generateToken(payload: object, expiresIn = "7d"): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): jwt.JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    } catch {
        return null;
    }
}

// ── Verification / Reset Tokens ─────────────────────────
export function generateRandomToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

// ── Session Cookie ──────────────────────────────────────
export async function setSessionCookie(userId: string, role: string, remember = false) {
    const token = generateToken({ userId, role }, remember ? "30d" : "7d");
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: remember ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60,
        path: "/",
    });
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload?.userId) return null;

    await connectDB();
    const user = await User.findById(payload.userId).select("-password -verificationToken -resetToken -resetTokenExpiry");
    if (!user || user.isBlocked) return null;

    return user;
}

// ── Account Lock ────────────────────────────────────────
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION = 15 * 60 * 1000; // 15 minutes

export function isAccountLocked(user: { loginAttempts: number; lockUntil: Date | null }): boolean {
    if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
        return true;
    }
    return false;
}

export async function incrementLoginAttempts(userId: string) {
    const user = await User.findById(userId);
    if (!user) return;

    user.loginAttempts += 1;
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_DURATION);
    }
    await user.save();
}

export async function resetLoginAttempts(userId: string) {
    await User.findByIdAndUpdate(userId, { loginAttempts: 0, lockUntil: null });
}
