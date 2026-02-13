"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Mail, Lock, User, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
    const [name, setName] = useState("");
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
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ height: 60, display: "flex", justifyContent: "center" }}>
                        <Logo className="h-full" showTagline />
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
                        Create Account
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                        Start your StakeWise journey today
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        window.location.href = "/dashboard";
                    }}
                    style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                    <div style={{ position: "relative" }}>
                        <User
                            size={18}
                            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                        />
                        <input
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            }}
                        />
                    </div>

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
                            }}
                        />
                    </div>

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
                            marginTop: 4,
                        }}
                    >
                        Create Account <ArrowRight size={18} />
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-secondary)" }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
