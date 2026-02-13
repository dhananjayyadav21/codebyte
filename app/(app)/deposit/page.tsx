"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ToastProvider";
import { ArrowLeft, Wallet, ShieldCheck, Zap, Lock, CreditCard, Smartphone, Banknote } from "lucide-react";
import Link from "next/link";

export default function DepositPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("razorpay");

    const quickAmounts = [100, 500, 1000, 5000];

    const handleDeposit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            showToast("Please enter a valid amount", "error");
            return;
        }

        setLoading(true);

        try {
            // Simulate Razorpay Opening
            await new Promise(resolve => setTimeout(resolve, 800));

            // In a real app, this would open window.Razorpay
            // Here we simulate the user completing payment
            showToast("Redirecting to Razorpay Secure Gateway...", "info");

            await new Promise(resolve => setTimeout(resolve, 2000));

            const res = await fetch("/api/wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    type: "DEPOSIT",
                    provider: "razorpay", // purely informative for now
                    paymentId: `pay_${Math.random().toString(36).substring(7)}`
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 animate-fade-in">
            <Link href="/dashboard" className="inline-flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </Link>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                {/* Left Column: Branding */}
                <div className="hidden lg:block lg:col-span-5 space-y-8 sticky top-24">
                    <div>
                        <h1 className="text-4xl font-extrabold text-[var(--text-primary)] leading-tight mb-4">
                            Add Funds to <br />
                            <span className="text-blue-600 dark:text-blue-400">StakeWise Wallet</span>
                        </h1>
                        <p className="text-lg text-[var(--text-secondary)]">
                            Power your portfolio with instant, secure deposits via Razorpay.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-600/20">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[var(--text-primary)] text-lg">Instant Credit</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">Funds reflect in your wallet within seconds of payment.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 px-4">
                            <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)] text-lg">Bank-Grade Security</h3>
                                <p className="text-[var(--text-secondary)]">Protected by 128-bit encryption.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Payment Form */}
                <div className="lg:col-span-7">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 md:p-8 shadow-2xl shadow-blue-900/5 relative overflow-hidden">

                        {/* Razorpay Badge */}
                        <div className="absolute top-0 right-0 bg-[#3395ff] text-white text-xs font-bold px-4 py-1 rounded-bl-xl shadow-lg">
                            Powered by Razorpay
                        </div>

                        <div className="lg:hidden mb-6">
                            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Add Funds</h1>
                            <p className="text-[var(--text-secondary)]">Secure deposit via Razorpay</p>
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Enter Amount</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-[var(--text-secondary)] group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">₹</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-4 py-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-4xl font-bold text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-[var(--text-muted)]"
                                    />
                                </div>
                            </div>

                            {/* Quick Select */}
                            <div className="grid grid-cols-4 gap-3">
                                {quickAmounts.map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => setAmount(amt.toString())}
                                        className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${amount === amt.toString()
                                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25 transform scale-105"
                                            : "bg-[var(--bg-secondary)] border-transparent text-[var(--text-secondary)] hover:bg-[var(--border-color)]"}`}
                                    >
                                        +₹{amt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <hr className="my-8 border-[var(--border-color)] border-dashed" />

                        {/* Payment Options Visual */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Payment Options Supported</label>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] gap-2 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-default">
                                    <Smartphone size={20} />
                                    <span className="text-xs font-semibold">UPI / GPay</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] gap-2 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-default">
                                    <CreditCard size={20} />
                                    <span className="text-xs font-semibold">Card</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] gap-2 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-default">
                                    <Banknote size={20} />
                                    <span className="text-xs font-semibold">Netbanking</span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleDeposit}
                            disabled={loading || !amount || parseFloat(amount) <= 0}
                            className="w-full mt-8 py-4 rounded-2xl bg-[#3395ff] hover:bg-[#2886e6] text-white font-bold text-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Pay {amount ? formatCurrency(parseFloat(amount)).replace("$", "₹") : ""}</span>
                                    <ArrowLeft className="rotate-180" size={20} />
                                </>
                            )}
                        </button>

                        <div className="flex justify-center items-center gap-2 text-xs text-[var(--text-muted)] mt-6 opacity-75">
                            <ShieldCheck size={12} />
                            <span>Secured by Razorpay 128-bit encryption</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
