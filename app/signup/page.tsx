"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import {
    Mail, Lock, User, ArrowRight, ArrowLeft, Eye, EyeOff,
    Phone, Calendar, MapPin, CreditCard, Building, FileText, Check, Shield
} from "lucide-react";

const STEPS = ["Personal", "Identity", "Banking", "Security"];

export default function SignupPage() {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        fullName: "", email: "", phone: "", dob: "",
        address: "", pan: "",
        bankAccount: "", ifscCode: "",
        password: "", confirmPassword: "",
    });

    const set = (key: string, val: string) => {
        setForm({ ...form, [key]: val });
        setFieldErrors({ ...fieldErrors, [key]: [] });
        setError("");
    };

    const getFieldError = (key: string) => fieldErrors[key]?.[0] || "";

    const validateStep = (): boolean => {
        const errs: Record<string, string[]> = {};
        if (step === 0) {
            if (!form.fullName.trim()) errs.fullName = ["Name is required"];
            if (!form.email.trim()) errs.email = ["Email is required"];
            if (!form.phone.trim()) errs.phone = ["Phone is required"];
            if (!form.dob) errs.dob = ["Date of birth is required"];
        } else if (step === 1) {
            if (!form.address.trim()) errs.address = ["Address is required"];
            if (!form.pan.trim()) errs.pan = ["PAN is required"];
        } else if (step === 2) {
            if (!form.bankAccount.trim()) errs.bankAccount = ["Bank account is required"];
            if (!form.ifscCode.trim()) errs.ifscCode = ["IFSC code is required"];
        }
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) setStep(step + 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.errors) setFieldErrors(data.errors);
                setError(data.error || "Signup failed");
            } else {
                setSuccess(true);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = (hasError: boolean) => ({
        width: "100%",
        padding: "14px 14px 14px 42px",
        borderRadius: 12,
        border: `1px solid ${hasError ? "var(--red)" : "var(--border-color)"}`,
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontSize: 14,
        outline: "none",
        transition: "border-color 0.2s",
    });

    if (success) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gradient-hero)", padding: 24 }}>
                <div className="glass animate-fade-in-up" style={{ width: "100%", maxWidth: 420, padding: 40, borderRadius: 24, textAlign: "center" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                        <Check size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Account Created!</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                        We&apos;ve sent a verification link to <strong>{form.email}</strong>. Please check your inbox and verify your email to log in.
                    </p>
                    <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, background: "var(--gradient-card)", color: "white", fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
                        Go to Login <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gradient-hero)", padding: 24 }}>
            <div className="glass animate-fade-in-up" style={{ width: "100%", maxWidth: 480, padding: 40, borderRadius: 24 }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div style={{ height: 50, display: "flex", justifyContent: "center" }}>
                        <Logo className="h-full" showTagline />
                    </div>
                </div>

                {/* Step Progress */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 32 }}>
                    {STEPS.map((label, i) => (
                        <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                            <div style={{ width: "100%", height: 4, borderRadius: 2, background: i <= step ? "var(--accent)" : "var(--border-color)", transition: "background 0.3s" }} />
                            <span style={{ fontSize: 11, fontWeight: i === step ? 700 : 400, color: i <= step ? "var(--accent)" : "var(--text-muted)" }}>{label}</span>
                        </div>
                    ))}
                </div>

                {error && (
                    <div style={{ padding: "12px 16px", borderRadius: 12, background: "var(--red-bg)", color: "var(--red)", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
                        {error}
                    </div>
                )}

                {/* Step 0: Personal */}
                {step === 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Personal Information</h2>
                        <div style={{ position: "relative" }}>
                            <User size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input placeholder="Full Name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} style={inputStyle(!!getFieldError("fullName"))} />
                            {getFieldError("fullName") && <span style={{ fontSize: 12, color: "var(--red)", marginTop: 4, display: "block" }}>{getFieldError("fullName")}</span>}
                        </div>
                        <div style={{ position: "relative" }}>
                            <Mail size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => set("email", e.target.value)} style={inputStyle(!!getFieldError("email"))} />
                            {getFieldError("email") && <span style={{ fontSize: 12, color: "var(--red)", marginTop: 4, display: "block" }}>{getFieldError("email")}</span>}
                        </div>
                        <div style={{ position: "relative" }}>
                            <Phone size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => set("phone", e.target.value)} style={inputStyle(!!getFieldError("phone"))} />
                            {getFieldError("phone") && <span style={{ fontSize: 12, color: "var(--red)", marginTop: 4, display: "block" }}>{getFieldError("phone")}</span>}
                        </div>
                        <div style={{ position: "relative" }}>
                            <Calendar size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input type="date" placeholder="Date of Birth" value={form.dob} onChange={(e) => set("dob", e.target.value)} style={inputStyle(!!getFieldError("dob"))} />
                            {getFieldError("dob") && <span style={{ fontSize: 12, color: "var(--red)", marginTop: 4, display: "block" }}>{getFieldError("dob")}</span>}
                        </div>
                    </div>
                )}

                {/* Step 1: Identity */}
                {step === 1 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Address & Identity</h2>
                        <div style={{ position: "relative" }}>
                            <MapPin size={18} style={{ position: "absolute", left: 14, top: 18, color: "var(--text-muted)" }} />
                            <textarea placeholder="Full Address" value={form.address} onChange={(e) => set("address", e.target.value)} rows={3} style={{ ...inputStyle(!!getFieldError("address")), resize: "vertical" as const, paddingTop: 14 }} />
                            {getFieldError("address") && <span style={{ fontSize: 12, color: "var(--red)", marginTop: 4, display: "block" }}>{getFieldError("address")}</span>}
                        </div>
                        <div style={{ position: "relative" }}>
                            <FileText size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input placeholder="PAN Number (e.g., ABCDE1234F)" value={form.pan} onChange={(e) => set("pan", e.target.value.toUpperCase())} maxLength={10} style={inputStyle(!!getFieldError("pan"))} />
                            {getFieldError("pan") && <span style={{ fontSize: 12, color: "var(--red)", marginTop: 4, display: "block" }}>{getFieldError("pan")}</span>}
                        </div>
                    </div>
                )}

                {/* Step 2: Banking */}
                {step === 2 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Banking Details</h2>
                        <div style={{ position: "relative" }}>
                            <CreditCard size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input placeholder="Bank Account Number" value={form.bankAccount} onChange={(e) => set("bankAccount", e.target.value.replace(/\D/g, ""))} style={inputStyle(!!getFieldError("bankAccount"))} />
                            {getFieldError("bankAccount") && <span style={{ fontSize: 12, color: "var(--red)", marginTop: 4, display: "block" }}>{getFieldError("bankAccount")}</span>}
                        </div>
                        <div style={{ position: "relative" }}>
                            <Building size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input placeholder="IFSC Code (e.g., SBIN0001234)" value={form.ifscCode} onChange={(e) => set("ifscCode", e.target.value.toUpperCase())} maxLength={11} style={inputStyle(!!getFieldError("ifscCode"))} />
                            {getFieldError("ifscCode") && <span style={{ fontSize: 12, color: "var(--red)", marginTop: 4, display: "block" }}>{getFieldError("ifscCode")}</span>}
                        </div>
                    </div>
                )}

                {/* Step 3: Security */}
                {step === 3 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                            <Shield size={20} style={{ display: "inline", marginRight: 8, verticalAlign: "text-bottom" }} />Set Your Password
                        </h2>
                        <div style={{ position: "relative" }}>
                            <Lock size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={(e) => set("password", e.target.value)} style={{ ...inputStyle(!!getFieldError("password")), paddingRight: 42 }} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            {getFieldError("password") && <span style={{ fontSize: 12, color: "var(--red)", marginTop: 4, display: "block" }}>{getFieldError("password")}</span>}
                        </div>
                        {/* Password strength */}
                        {form.password && (
                            <div style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                                {[
                                    { label: "8+ characters", ok: form.password.length >= 8 },
                                    { label: "Uppercase letter", ok: /[A-Z]/.test(form.password) },
                                    { label: "Lowercase letter", ok: /[a-z]/.test(form.password) },
                                    { label: "Number", ok: /[0-9]/.test(form.password) },
                                    { label: "Special character", ok: /[^A-Za-z0-9]/.test(form.password) },
                                ].map((r) => (
                                    <span key={r.label} style={{ color: r.ok ? "var(--green)" : "var(--text-muted)" }}>
                                        {r.ok ? "✓" : "○"} {r.label}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div style={{ position: "relative" }}>
                            <Lock size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} style={inputStyle(!!getFieldError("confirmPassword"))} />
                            {getFieldError("confirmPassword") && <span style={{ fontSize: 12, color: "var(--red)", marginTop: 4, display: "block" }}>{getFieldError("confirmPassword")}</span>}
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                    {step > 0 && (
                        <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: 14, borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            <ArrowLeft size={18} /> Back
                        </button>
                    )}
                    {step < 3 ? (
                        <button onClick={nextStep} style={{ flex: 1, padding: 14, borderRadius: 12, border: "none", background: "var(--gradient-card)", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            Next <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: 14, borderRadius: 12, border: "none", background: "var(--gradient-card)", color: "white", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            {loading ? "Creating Account..." : "Create Account"} {!loading && <ArrowRight size={18} />}
                        </button>
                    )}
                </div>

                <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-secondary)" }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
