"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Shield } from "lucide-react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Login failed");
            } else {
                window.location.href = "/admin/dashboard";
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", padding: 24 }}>
            <div className="glass animate-fade-in-up" style={{ width: "100%", maxWidth: 420, padding: 40, borderRadius: 24 }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ height: 50, display: "flex", justifyContent: "center" }}>
                        <Logo className="h-full" />
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 20, background: "rgba(99,102,241,0.15)", color: "var(--accent)", fontSize: 12, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>
                        <Shield size={14} /> ADMIN PANEL
                    </div>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>Admin Login</h1>
                </div>

                {error && (
                    <div style={{ padding: "12px 16px", borderRadius: 12, background: "var(--red-bg)", color: "var(--red)", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>{error}</div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ position: "relative" }}>
                        <Mail size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                        <input type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "14px 14px 14px 42px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: 14, outline: "none" }} />
                    </div>
                    <div style={{ position: "relative" }}>
                        <Lock size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                        <input type={showPassword ? "text" : "password"} placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "14px 42px 14px 42px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: 14, outline: "none" }} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "var(--gradient-card)", color: "white", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        {loading ? "Authenticating..." : "Access Admin Panel"} {!loading && <ArrowRight size={18} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
