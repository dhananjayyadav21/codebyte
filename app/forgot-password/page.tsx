"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Mail, ArrowLeft, Check } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to send reset link");
            } else {
                setSent(true);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gradient-hero)", padding: 24 }}>
            <div className="glass animate-fade-in-up" style={{ width: "100%", maxWidth: 420, padding: 40, borderRadius: 24 }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ height: 50, display: "flex", justifyContent: "center" }}>
                        <Logo className="h-full" />
                    </div>
                </div>

                {sent ? (
                    <div style={{ textAlign: "center" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                            <Check size={32} color="white" />
                        </div>
                        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Check Your Email</h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>If an account with <strong>{email}</strong> exists, we&apos;ve sent a password reset link.</p>
                        <Link href="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none", fontSize: 14 }}>
                            <ArrowLeft size={16} style={{ display: "inline", verticalAlign: "text-bottom", marginRight: 4 }} /> Back to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Forgot Password?</h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>Enter your email and we&apos;ll send you a reset link.</p>

                        {error && (
                            <div style={{ padding: "12px 16px", borderRadius: 12, background: "var(--red-bg)", color: "var(--red)", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={{ position: "relative" }}>
                                <Mail size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "14px 14px 14px 42px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: 14, outline: "none" }} />
                            </div>
                            <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "var(--gradient-card)", color: "white", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>

                        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14 }}>
                            <Link href="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                                <ArrowLeft size={14} style={{ display: "inline", verticalAlign: "text-bottom", marginRight: 4 }} /> Back to Login
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
