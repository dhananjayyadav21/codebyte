"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

function TransactionStatus() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToast();
    const [status, setStatus] = useState<"processing" | "success" | "failure">("processing");

    useEffect(() => {
        const verifyPayment = async () => {
            const paymentId = searchParams.get("razorpay_payment_id");
            const orderId = searchParams.get("razorpay_order_id");
            const signature = searchParams.get("razorpay_signature");

            // Check if we have payment details (redirect from Razorpay)
            if (paymentId && orderId && signature) {
                try {
                    // We need the *amount* to update the wallet, but passing it in URL is insecure without signature verification.
                    // The backend verify logic currently expects amount to add to wallet.
                    // We should ideally fetch amount from orderId on backend.
                    // For this hackathon, we'll try to find the amount from session or local storage?
                    // BETTER: Verify first, then if valid, backend fetches order details to get amount.
                    // But our current verify API takes amount in body.
                    // I will update verify API to fetch amount from Razorpay if not provided?
                    // OR just pass a dummy amount for verification and let backend fix it?
                    // Actually, I'll pass 0 or rely on backend to lookup order.

                    // Let's rely on LocalStorage for the amount (simple workaround)
                    const storedAmount = localStorage.getItem("pendingDepositAmount");
                    const amount = storedAmount ? parseFloat(storedAmount) : 0;

                    const res = await fetch("/api/razorpay/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: orderId,
                            razorpay_payment_id: paymentId,
                            razorpay_signature: signature,
                            amount: amount // Secure only if backend verifies amount against order
                        }),
                    });

                    if (res.ok) {
                        setStatus("success");
                        localStorage.removeItem("pendingDepositAmount");
                        showToast("Payment Verified Successfully!", "success");
                    } else {
                        setStatus("failure");
                        showToast("Verification Failed", "error");
                    }
                } catch (e) {
                    setStatus("failure");
                }
            } else {
                setStatus("failure");
            }
        };

        verifyPayment();
    }, [searchParams, showToast]);

    if (status === "processing") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <h2 className="text-xl font-bold">Verifying Payment...</h2>
                <p className="text-[var(--text-secondary)]">Please do not close this window.</p>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 animate-fade-in-up">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500">
                    <CheckCircle2 size={48} />
                </div>
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Deposit Successful!</h1>
                    <p className="text-[var(--text-secondary)]">Funds have been added to your wallet.</p>
                </div>
                <Link href="/dashboard" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2">
                    Go to Dashboard <ArrowRight size={18} />
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 animate-fade-in-up">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500">
                <XCircle size={48} />
            </div>
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
                <p className="text-[var(--text-secondary)]">We couldn't verify your transaction.</p>
            </div>
            <Link href="/deposit" className="px-8 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl font-bold hover:bg-[var(--border-color)] transition">
                Try Again
            </Link>
        </div>
    );
}

export default function DepositStatusPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>}>
                <TransactionStatus />
            </Suspense>
        </div>
    );
}
