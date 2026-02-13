"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, remember }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
            } else {
                window.location.href = "/dashboard";
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "14px 14px 14px 42px",
        borderRadius: 12,
        border: `1px solid ${error ? "var(--red)" : "var(--border-color)"}`,
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontSize: 14,
        outline: "none",
        transition: "border-color 0.2s",
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gradient-hero)", padding: 24 }}>
            <div className="glass animate-fade-in-up" style={{ width: "100%", maxWidth: 420, padding: 40, borderRadius: 24 }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ height: 60, display: "flex", justifyContent: "center" }}>
                        <Logo className="h-full" showTagline />
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Welcome Back</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Sign in to your StakeWise account</p>
                </div>

                {error && (
                    <div style={{ padding: "12px 16px", borderRadius: 12, background: "var(--red-bg)", color: "var(--red)", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ position: "relative" }}>
                        <Mail size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                        <input type="email" placeholder="Email address" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} required style={inputStyle} />
                    </div>

                    <div style={{ position: "relative" }}>
                        <Lock size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                        <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} required style={{ ...inputStyle, paddingRight: 42 }} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)", cursor: "pointer" }}>
                            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ accentColor: "var(--accent)" }} />
                            Remember me
                        </label>
                        <Link href="/forgot-password" style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "var(--gradient-card)", color: "white", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
                        {loading ? "Signing in..." : "Sign In"} {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-secondary)" }}>
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}
