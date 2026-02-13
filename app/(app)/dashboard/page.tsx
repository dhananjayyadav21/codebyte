"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    PieChart,
    Activity,
    ArrowUpRight,
    ArrowDownLeft,
    Briefcase,
    Plus
} from "lucide-react";
import Link from "next/link";

interface PortfolioItem {
    stockId: string;
    symbol: string;
    stockName: string;
    shares: number;
    averageBuyPrice: number;
    currentPrice: number;
    currentValue: number;
    gainLoss: number;
    gainLossPercent: number;
}

interface Transaction {
    _id: string;
    symbol: string;
    type: "BUY" | "SELL";
    shares: number;
    price: number;
    totalAmount: number;
    date: string;
}

interface DashboardData {
    balance: number;
    totalInvested: number;
    currentValue: number;
    totalGainLoss: number;
    portfolio: PortfolioItem[];
    recentActivity: Transaction[];
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/portfolio")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="p-8 flex justify-center text-[var(--text-muted)]">
                Loading dashboard...
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Dashboard</h1>
                    <p className="text-[var(--text-secondary)]">Overview of your investments</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/deposit" className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold hover:bg-[var(--border-color)] transition-colors">
                        Deposit
                    </Link>
                    <Link href="/stocks" className="px-4 py-2 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
                        <Plus size={18} /> New Trade
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Value */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <Briefcase size={20} />
                        <span className="text-sm font-medium">Portfolio Value</span>
                    </div>
                    <div className="text-4xl font-extrabold mb-4">
                        {formatCurrency(data.currentValue + data.balance)}
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-xs opacity-70 mb-1">Cash Balance</div>
                            <div className="text-lg font-bold">{formatCurrency(data.balance)}</div>
                        </div>
                        <div className="bg-white/20 px-3 py-1 rounded-lg text-sm font-bold backdrop-blur-sm">
                            {data.totalGainLoss >= 0 ? "+" : ""}{formatCurrency(data.totalGainLoss)}
                        </div>
                    </div>
                </div>

                {/* Gain/Loss */}
                <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <div className="flex items-center gap-2 mb-6 text-[var(--text-secondary)]">
                        <TrendingUp size={20} />
                        <span className="text-sm font-medium">Total Returns</span>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${data.totalGainLoss >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {data.totalGainLoss >= 0 ? "+" : ""}{formatCurrency(data.totalGainLoss)}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                        All time profit/loss
                    </div>
                </div>

                {/* Invested */}
                <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                    <div className="flex items-center gap-2 mb-6 text-[var(--text-secondary)]">
                        <PieChart size={20} />
                        <span className="text-sm font-medium">Invested Capital</span>
                    </div>
                    <div className="text-3xl font-bold mb-2 text-[var(--text-primary)]">
                        {formatCurrency(data.totalInvested)}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                        Cost basis of current holdings
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Holdings */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Your Assets</h2>
                    {data.portfolio.length === 0 ? (
                        <div className="p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] text-center text-[var(--text-muted)]">
                            <p className="mb-4">No assets found.</p>
                            <Link href="/stocks" className="text-indigo-500 hover:underline">Start Investing</Link>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {data.portfolio.map((item) => (
                                <Link href={`/stocks/${item.stockId}`} key={item.stockId} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-indigo-500/30 transition-all hover:shadow-md">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center font-bold text-lg text-[var(--text-primary)]">
                                            {item.symbol[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[var(--text-primary)]">{item.symbol}</h3>
                                            <p className="text-xs text-[var(--text-secondary)]">{item.shares.toFixed(4)} shares</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-[var(--text-primary)]">{formatCurrency(item.currentValue)}</div>
                                        <div className={`text-xs font-semibold ${item.gainLoss >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                                            {item.gainLoss >= 0 ? "+" : ""}{formatCurrency(item.gainLoss)} ({item.gainLossPercent.toFixed(2)}%)
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Activity */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Recent Activity</h2>
                    <div className="space-y-4">
                        {data.recentActivity.map((tx) => (
                            <div key={tx._id} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${tx.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {tx.type === 'BUY' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-[var(--text-primary)]">
                                            {tx.type === 'BUY' ? 'Bought' : 'Sold'} {tx.symbol}
                                        </div>
                                        <div className="text-xs text-[var(--text-muted)]">
                                            {new Date(tx.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-sm text-[var(--text-primary)]">
                                        {formatCurrency(tx.totalAmount)}
                                    </div>
                                    <div className="text-xs text-[var(--text-secondary)]">
                                        {tx.shares.toFixed(4)} shares
                                    </div>
                                </div>
                            </div>
                        ))}
                        {data.recentActivity.length === 0 && (
                            <div className="text-center text-[var(--text-muted)] py-4">No recent activity</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
