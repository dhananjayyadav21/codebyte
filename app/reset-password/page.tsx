"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Lock, Eye, EyeOff, Check, ArrowRight } from "lucide-react";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password, confirmPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Reset failed");
                if (data.errors?.password) setError(data.errors.password[0]);
            } else {
                setSuccess(true);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="glass animate-fade-in-up" style={{ width: "100%", maxWidth: 420, padding: 40, borderRadius: 24, textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                    <Check size={32} color="white" />
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Password Reset!</h1>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>Your password has been changed. You can now log in.</p>
                <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, background: "var(--gradient-card)", color: "white", fontWeight: 700, textDecoration: "none" }}>
                    Sign In <ArrowRight size={18} />
                </Link>
            </div>
        );
    }

    return (
        <div className="glass animate-fade-in-up" style={{ width: "100%", maxWidth: 420, padding: 40, borderRadius: 24 }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ height: 50, display: "flex", justifyContent: "center" }}>
                    <Logo className="h-full" />
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4, marginTop: 16 }}>Set New Password</h1>
                <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Choose a strong password for your account</p>
            </div>

            {error && (
                <div style={{ padding: "12px 16px", borderRadius: 12, background: "var(--red-bg)", color: "var(--red)", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>{error}</div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ position: "relative" }}>
                    <Lock size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input type={showPassword ? "text" : "password"} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "14px 42px 14px 42px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: 14, outline: "none" }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {password && (
                    <div style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 3 }}>
                        {[
                            { label: "8+ characters", ok: password.length >= 8 },
                            { label: "Uppercase", ok: /[A-Z]/.test(password) },
                            { label: "Lowercase", ok: /[a-z]/.test(password) },
                            { label: "Number", ok: /[0-9]/.test(password) },
                            { label: "Special char", ok: /[^A-Za-z0-9]/.test(password) },
                        ].map((r) => (
                            <span key={r.label} style={{ color: r.ok ? "var(--green)" : "var(--text-muted)" }}>{r.ok ? "✓" : "○"} {r.label}</span>
                        ))}
                    </div>
                )}
                <div style={{ position: "relative" }}>
                    <Lock size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ width: "100%", padding: "14px 14px 14px 42px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: 14, outline: "none" }} />
                </div>
                <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "var(--gradient-card)", color: "white", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gradient-hero)", padding: 24 }}>
            <Suspense fallback={<div style={{ color: "white" }}>Loading...</div>}>
                <ResetPasswordContent />
            </Suspense>
        </div>
    );
}
