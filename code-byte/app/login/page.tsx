"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--gradient-hero)",
                padding: 24,
            }}
        >
            <div
                className="glass animate-fade-in-up"
                style={{
                    width: "100%",
                    maxWidth: 420,
                    padding: 40,
                    borderRadius: 24,
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 14,
                            background: "var(--gradient-card)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 16,
                        }}
                    >
                        <Sparkles size={24} color="white" />
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                        Sign in to your CodeByte account
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        window.location.href = "/dashboard";
                    }}
                    style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                    {/* Email */}
                    <div style={{ position: "relative" }}>
                        <Mail
                            size={18}
                            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                        />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "14px 14px 14px 42px",
                                borderRadius: 12,
                                border: "1px solid var(--border-color)",
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)",
                                fontSize: 14,
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ position: "relative" }}>
                        <Lock
                            size={18}
                            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "14px 42px 14px 42px",
                                borderRadius: 12,
                                border: "1px solid var(--border-color)",
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)",
                                fontSize: 14,
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "14px",
                            borderRadius: 12,
                            border: "none",
                            background: "var(--gradient-card)",
                            color: "white",
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            marginTop: 4,
                        }}
                    >
                        Sign In <ArrowRight size={18} />
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-secondary)" }}>
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
