"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, XCircle, Loader2 } from "lucide-react";
import { Suspense } from "react";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Missing verification token");
            return;
        }

        fetch(`/api/auth/verify-email?token=${token}`)
            .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
            .then(({ ok, data }) => {
                setStatus(ok ? "success" : "error");
                setMessage(data.message || data.error);
            })
            .catch(() => {
                setStatus("error");
                setMessage("Something went wrong. Please try again.");
            });
    }, [token]);

    return (
        <div className="glass animate-fade-in-up" style={{ width: "100%", maxWidth: 420, padding: 48, borderRadius: 24, textAlign: "center" }}>
            {status === "loading" && (
                <>
                    <Loader2 size={48} style={{ color: "var(--accent)", animation: "spin 1s linear infinite", margin: "0 auto 24px" }} />
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>Verifying your email...</h1>
                </>
            )}

            {status === "success" && (
                <>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                        <Check size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Email Verified!</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>{message}</p>
                    <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, background: "var(--gradient-card)", color: "white", fontWeight: 700, textDecoration: "none" }}>
                        Sign In
                    </Link>
                </>
            )}

            {status === "error" && (
                <>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                        <XCircle size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Verification Failed</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>{message}</p>
                    <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, background: "var(--gradient-card)", color: "white", fontWeight: 700, textDecoration: "none" }}>
                        Sign Up Again
                    </Link>
                </>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gradient-hero)", padding: 24 }}>
            <Suspense fallback={
                <div className="glass" style={{ width: "100%", maxWidth: 420, padding: 48, borderRadius: 24, textAlign: "center" }}>
                    <Loader2 size={48} style={{ color: "var(--accent)", animation: "spin 1s linear infinite", margin: "0 auto 24px" }} />
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>Loading...</h1>
                </div>
            }>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
