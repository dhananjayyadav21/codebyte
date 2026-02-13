"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ToastProvider";
import { ArrowLeft, CreditCard, Wallet, CheckCircle2, Loader2, ShieldCheck, Zap, Lock, DollarSign } from "lucide-react";
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <Link href="/dashboard" className="inline-flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </Link>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                {/* Left Column: Info & Trust (Visible on Large) */}
                <div className="hidden lg:block lg:col-span-5 space-y-8 sticky top-24">
                    <div>
                        <h1 className="text-4xl font-extrabold text-[var(--text-primary)] leading-tight mb-4">
                            Fund Your <br />
                            <span className="text-indigo-500">Trading Journey</span>
                        </h1>
                        <p className="text-lg text-[var(--text-secondary)]">
                            Securely add funds to your wallet and start investing in the world's leading companies today.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)] text-lg">Instant Deposits</h3>
                                <p className="text-[var(--text-secondary)]">Funds are available in your account immediately after processing.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)] text-lg">Bank-Grade Security</h3>
                                <p className="text-[var(--text-secondary)]">We use 256-bit encryption to ensure your financial data is safe.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)] text-lg">Zero Fees</h3>
                                <p className="text-[var(--text-secondary)]">Enjoy 0% commission on all deposits and trades.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Deposit Form */}
                <div className="lg:col-span-7">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 md:p-8 shadow-2xl shadow-indigo-500/5">
                        <div className="lg:hidden mb-6">
                            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Add Funds</h1>
                            <p className="text-[var(--text-secondary)]">Securely deposit money</p>
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Amount to Deposit</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-[var(--text-secondary)] group-focus-within:text-[var(--text-primary)] transition-colors">$</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-4 py-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-4xl font-bold text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-[var(--text-muted)]"
                                    />
                                </div>
                            </div>

                            {/* Quick Select */}
                            <div className="grid grid-cols-4 gap-3">
                                {quickAmounts.map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => setAmount(amt.toString())}
                                        className={`py-3 rounded-xl text-sm font-bold transition-all border ${amount === amt.toString()
                                            ? "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/25 transform scale-105"
                                            : "bg-[var(--bg-secondary)] border-transparent text-[var(--text-secondary)] hover:bg-[var(--border-color)]"}`}
                                    >
                                        +${amt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <hr className="my-8 border-[var(--border-color)]" />

                        {/* Payment Method */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Payment Method</label>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div
                                    onClick={() => setPaymentMethod("card")}
                                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${paymentMethod === "card" ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/20" : "border-[var(--border-color)] hover:border-[var(--text-muted)]"}`}
                                >
                                    <div className={`p-2 rounded-xl transition-colors ${paymentMethod === "card" ? "bg-indigo-500 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-[var(--text-primary)] text-sm">Credit Card</div>
                                        <div className="text-xs text-[var(--text-secondary)] mt-0.5">Instant fees</div>
                                    </div>
                                    {paymentMethod === "card" && <div className="absolute top-0 right-0 p-1.5 bg-indigo-500 text-white rounded-bl-xl"><CheckCircle2 size={12} /></div>}
                                </div>

                                <div
                                    onClick={() => setPaymentMethod("bank")}
                                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${paymentMethod === "bank" ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/20" : "border-[var(--border-color)] hover:border-[var(--text-muted)]"}`}
                                >
                                    <div className={`p-2 rounded-xl transition-colors ${paymentMethod === "bank" ? "bg-indigo-500 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>
                                        <Wallet size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-[var(--text-primary)] text-sm">Bank Transfer</div>
                                        <div className="text-xs text-[var(--text-secondary)] mt-0.5">1-3 days</div>
                                    </div>
                                    {paymentMethod === "bank" && <div className="absolute top-0 right-0 p-1.5 bg-indigo-500 text-white rounded-bl-xl"><CheckCircle2 size={12} /></div>}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleDeposit}
                            disabled={loading}
                            className="w-full mt-8 py-4 rounded-2xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-lg hover:opacity-90 hover:scale-[1.01] transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : `Deposit ${amount ? formatCurrency(parseFloat(amount)) : "Funds"}`}
                        </button>

                        <div className="flex justify-center items-center gap-2 text-xs text-[var(--text-muted)] mt-6">
                            <ShieldCheck size={14} />
                            <span>processed securely via</span>
                            <span className="font-bold text-[var(--text-primary)]">Stripe</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
