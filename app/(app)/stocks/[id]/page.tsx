"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { formatCurrency, formatPercent, formatCompact } from "@/lib/utils";
import { useToast } from "@/components/ToastProvider";
import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Star,
    Sparkles,
    ShieldCheck,
    AlertTriangle,
    Calculator,
    Info,
    Loader2,
    Briefcase,
    PieChart
} from "lucide-react";
import Link from "next/link";

interface Stock {
    _id: string;
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    marketCap: number;
    volume: number;
    high52w: number;
    low52w: number;
    pe: number;
    eps: number;
    dividend: number;
    sector: string;
    risk: "Low" | "Medium" | "High";
    growthScore: number;
    aiRecommendation: "Strong Buy" | "Buy" | "Hold" | "Risky";
    description: string;
    history: { date: string; price: number }[];
    logo: string;
    userBalance?: number;
    userShares?: number;
    totalShares?: number;
    availableShares?: number;
}

export default function StockDetailPage() {
    const params = useParams();
    const { showToast } = useToast();

    const [stock, setStock] = useState<Stock | null>(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState("");
    const [isTrading, setIsTrading] = useState(false);
    const [activeTab, setActiveTab] = useState<"BUY" | "SELL">("BUY");

    const fetchStock = () => {
        fetch(`/api/stocks/${params.id}`)
            .then(res => {
                if (!res.ok) throw new Error("Stock not found");
                return res.json();
            })
            .then(data => {
                setStock(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStock();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-[var(--text-muted)]">
                <Loader2 className="animate-spin mr-2" /> Loading...
            </div>
        );
    }

    if (!stock) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-[var(--text-muted)]">
                <p className="mb-4 text-lg">Stock not found.</p>
                <Link href="/stocks" className="text-[var(--accent)] hover:underline">Go back to Market</Link>
            </div>
        );
    }

    const sharesToTrade = amount ? parseFloat(amount) / stock.price : 0;
    const simReturn1y = amount ? parseFloat(amount) * (stock.growthScore / 100) * 0.3 : 0;

    // Inventory Calc
    const totalShares = stock.totalShares || 1000000;
    const availableShares = stock.availableShares !== undefined ? stock.availableShares : totalShares;
    const soldShares = totalShares - availableShares;
    const ownershipPercent = (soldShares / totalShares) * 100;

    // AI Recommendation Colors
    const getRecStyles = (rec: string) => {
        switch (rec) {
            case "Strong Buy": return { bg: "bg-emerald-500/10", text: "text-emerald-500", icon: ShieldCheck };
            case "Buy": return { bg: "bg-cyan-500/10", text: "text-cyan-500", icon: ShieldCheck };
            case "Hold": return { bg: "bg-yellow-500/10", text: "text-yellow-500", icon: AlertTriangle };
            default: return { bg: "bg-red-500/10", text: "text-red-500", icon: AlertTriangle };
        }
    };

    const recStyle = getRecStyles(stock.aiRecommendation);
    const RecIcon = recStyle.icon;

    const handleTrade = async () => {
        if (!amount || parseFloat(amount) <= 0) return;
        setIsTrading(true);

        // Validation
        if (activeTab === "BUY") {
            if (stock.userBalance !== undefined && parseFloat(amount) > stock.userBalance) {
                showToast("Insufficient funds", "error");
                setIsTrading(false);
                return;
            }
            // Check inventory
            if (sharesToTrade > availableShares) {
                showToast(`Only ${availableShares.toFixed(2)} shares available!`, "error");
                setIsTrading(false);
                return;
            }
        }
        if (activeTab === "SELL" && stock.userShares !== undefined && sharesToTrade > stock.userShares) {
            showToast("Insufficient shares", "error");
            setIsTrading(false);
            return;
        }

        try {
            const payload = {
                stockId: stock._id,
                type: activeTab,
                amount: parseFloat(amount)
            };

            const res = await fetch("/api/trade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Trade failed");

            const action = activeTab === "BUY" ? "Bought" : "Sold";
            showToast(`${action} ${data.shares.toFixed(4)} shares of ${stock.symbol} for $${amount}!`, "success");
            setAmount("");

            // Refresh data to update balance/shares/inventory
            fetchStock();

        } catch (error: any) {
            showToast(error.message, "error");
        } finally {
            setIsTrading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Back Nav */}
            <Link
                href="/stocks"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
                <ArrowLeft size={16} /> Back to Stocks
            </Link>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center text-4xl shadow-sm border border-[var(--border-color)]">
                        {stock.logo}
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                            {stock.symbol}
                        </h1>
                        <p className="text-[var(--text-secondary)] font-medium">{stock.name}</p>
                    </div>
                </div>

                <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-2 md:gap-0">
                    <div className="text-3xl font-extrabold text-[var(--text-primary)]">
                        {formatCurrency(stock.price)}
                    </div>
                    <div className={`flex items-center gap-1.5 font-bold text-sm px-2.5 py-1 rounded-full ${stock.changePercent >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                        {stock.changePercent >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {formatCurrency(Math.abs(stock.change))} ({formatPercent(stock.changePercent)})
                    </div>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Chart & Fundamentals (2/3 width on large) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Price Chart Card */}
                    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-[var(--text-primary)]">Price History</h3>
                            <select className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm rounded-lg px-3 py-1 border border-[var(--border-color)] outline-none">
                                <option>3 Months</option>
                                <option>1 Year</option>
                                <option>5 Years</option>
                            </select>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stock.history}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                                        tickLine={false}
                                        axisLine={false}
                                        interval={14}
                                        tickFormatter={(v) => {
                                            const d = new Date(v);
                                            return `${d.getMonth() + 1}/${d.getDate()}`;
                                        }}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(v) => `$${v}`}
                                        width={50}
                                        domain={["auto", "auto"]}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: "var(--bg-card)",
                                            border: "1px solid var(--border-color)",
                                            borderRadius: 12,
                                            fontSize: 13,
                                            color: "var(--text-primary)",
                                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                        }}
                                        formatter={(value: unknown) => [formatCurrency(Number(value)), "Price"]}
                                        labelStyle={{ color: "var(--text-secondary)", marginBottom: 4 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#6366f1"
                                        strokeWidth={2}
                                        fill="url(#colorPrice)"
                                        activeDot={{ r: 6, fill: "#6366f1", stroke: "var(--bg-card)", strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Fundamentals Card */}
                    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
                        <h3 className="font-bold text-[var(--text-primary)] mb-6">Market Stats</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                            {[
                                { label: "Market Cap", value: formatCompact(stock.marketCap), desc: "Total value" },
                                { label: "P/E Ratio", value: stock.pe.toFixed(1), desc: "Price/Earnings" },
                                { label: "EPS", value: `$${stock.eps.toFixed(2)}`, desc: "Earnings/Share" },
                                { label: "Dividend", value: stock.dividend > 0 ? `$${stock.dividend.toFixed(2)}` : "None", desc: "Yield" },
                                { label: "52W High", value: formatCurrency(stock.high52w), desc: "Yearly high" },
                                { label: "52W Low", value: formatCurrency(stock.low52w), desc: "Yearly low" },
                                { label: "Volume", value: formatCompact(stock.volume), desc: "Daily trade" },
                                { label: "Sector", value: stock.sector, desc: "Industry" },
                            ].map((item) => (
                                <div key={item.label} className="flex flex-col">
                                    <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] mb-1">
                                        {item.label}
                                        <Info size={10} className="opacity-50" />
                                    </div>
                                    <div className="font-semibold text-[var(--text-primary)] text-sm md:text-base">
                                        {item.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Calculator & AI (1/3 width on large) */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Inventory Status Card */}
                    <div className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
                        <div className="flex items-center gap-2 mb-3 text-[var(--text-secondary)]">
                            <PieChart size={18} />
                            <span className="text-sm font-bold uppercase tracking-wider">Market Inventory</span>
                        </div>
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">
                                    {formatCompact(availableShares)}
                                </p>
                                <p className="text-xs text-[var(--text-secondary)]">Available Shares</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-indigo-500">{ownershipPercent.toFixed(1)}%</p>
                                <p className="text-xs text-[var(--text-secondary)]">Owned by Users</p>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                style={{ width: `${ownershipPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Buy/Sell Calculator */}
                    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm sticky top-24">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                                <Calculator size={20} />
                            </div>
                            <h3 className="font-bold text-[var(--text-primary)]">Trade {stock.symbol}</h3>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1 mb-6 bg-[var(--bg-secondary)] rounded-xl">
                            <button
                                onClick={() => setActiveTab("BUY")}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "BUY" ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                            >
                                Buy
                            </button>
                            <button
                                onClick={() => setActiveTab("SELL")}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "SELL" ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                            >
                                Sell
                            </button>
                        </div>

                        {/* Balance/Holding Info */}
                        <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-2 font-medium">
                            {activeTab === "BUY" ? (
                                <span>Balance: <span className="text-[var(--text-primary)]">{formatCurrency(stock.userBalance || 0)}</span></span>
                            ) : (
                                <span>Owned: <span className="text-[var(--text-primary)]">{(stock.userShares || 0).toFixed(4)} shares</span></span>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] font-semibold text-lg">$</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min="1"
                                    className="w-full pl-10 pr-4 py-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-lg font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-[var(--text-muted)]"
                                />
                            </div>

                            {amount && parseFloat(amount) > 0 && (
                                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2 animate-fade-in-up">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--text-secondary)]">Est. Shares</span>
                                        <span className="font-bold text-[var(--text-primary)]">{sharesToTrade.toFixed(4)}</span>
                                    </div>
                                    {activeTab === "BUY" && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--text-secondary)]">Est. 1Y Return</span>
                                            <span className="font-bold text-emerald-500">+{formatCurrency(simReturn1y)}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={handleTrade}
                                disabled={isTrading}
                                className={`w-full py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === "BUY"
                                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                                    }`}
                            >
                                {isTrading ? <Loader2 className="animate-spin" /> : `${activeTab === "BUY" ? "Buy" : "Sell"} ${stock.symbol}`}
                            </button>
                            <p className="text-xs text-center text-[var(--text-muted)] mt-4">
                                Market is Open • Real-time execution
                            </p>
                        </div>
                    </div>

                    {/* AI Analysis Card */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-indigo-500">
                            <Sparkles size={20} />
                            <span className="font-bold">AI Analysis</span>
                        </div>

                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm mb-4 ${recStyle.bg} ${recStyle.text}`}>
                            <RecIcon size={16} /> {stock.aiRecommendation}
                        </div>

                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                            {stock.description}
                        </p>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]">
                            <span className="text-xs font-semibold text-[var(--text-secondary)]">Growth Score</span>
                            <div className="flex items-center gap-1 font-bold text-amber-500">
                                <Star size={14} fill="currentColor" /> {stock.growthScore}/100
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
