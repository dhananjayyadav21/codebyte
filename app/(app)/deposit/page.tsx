"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ToastProvider";
import { ArrowLeft, CreditCard, Wallet, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function DepositPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");

    const quickAmounts = [100, 500, 1000, 5000];

    const handleDeposit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            showToast("Please enter a valid amount", "error");
            return;
        }

        setLoading(true);

        try {
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const res = await fetch("/api/wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    type: "DEPOSIT"
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Deposit failed");

            showToast(`Successfully deposited ${formatCurrency(parseFloat(amount))}!`, "success");
            router.push("/dashboard");
            router.refresh();

        } catch (error: any) {
            showToast(error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8 flex items-center justify-center">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <Link href="/dashboard" className="inline-flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4">
                        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Add Funds</h1>
                    <p className="text-[var(--text-secondary)]">Securely deposit money into your wallet</p>
                </div>

                {/* Main Card */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 md:p-8 shadow-xl space-y-6">

                    {/* Amount Input */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">Amount to Deposit</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[var(--text-secondary)]">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-10 pr-4 py-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-3xl font-bold text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-[var(--text-muted)]"
                            />
                        </div>

                        {/* Quick Select */}
                        <div className="grid grid-cols-4 gap-2">
                            {quickAmounts.map(amt => (
                                <button
                                    key={amt}
                                    onClick={() => setAmount(amt.toString())}
                                    className={`py-2 rounded-lg text-sm font-semibold transition-all ${amount === amt.toString() ? "bg-indigo-500 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]"}`}
                                >
                                    +${amt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">Payment Method</label>
                        <div
                            onClick={() => setPaymentMethod("card")}
                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === "card" ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/20" : "border-[var(--border-color)] hover:border-[var(--text-muted)]"}`}
                        >
                            <div className="p-2 rounded-lg bg-[var(--bg-primary)] text-indigo-500">
                                <CreditCard size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-[var(--text-primary)]">Credit / Debit Card</div>
                                <div className="text-xs text-[var(--text-secondary)]">Instant processing</div>
                            </div>
                            {paymentMethod === "card" && <CheckCircle2 className="text-indigo-500" size={20} />}
                        </div>

                        <div
                            onClick={() => setPaymentMethod("bank")}
                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === "bank" ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/20" : "border-[var(--border-color)] hover:border-[var(--text-muted)]"}`}
                        >
                            <div className="p-2 rounded-lg bg-[var(--bg-primary)] text-emerald-500">
                                <Wallet size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-[var(--text-primary)]">Bank Transfer</div>
                                <div className="text-xs text-[var(--text-secondary)]">1-3 business days</div>
                            </div>
                            {paymentMethod === "bank" && <CheckCircle2 className="text-indigo-500" size={20} />}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleDeposit}
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-lg hover:opacity-90 transition-opacity flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : `Deposit ${amount ? formatCurrency(parseFloat(amount)) : ""}`}
                    </button>

                    <div className="flex justify-center items-center gap-2 text-xs text-[var(--text-muted)]">
                        <ShieldCheck size={14} /> 256-bit Secure Encryption
                    </div>

                </div>
            </div>
        </div>
    );
}
