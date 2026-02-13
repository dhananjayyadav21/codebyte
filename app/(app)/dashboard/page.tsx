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
    Plus,
    Wallet
} from "lucide-react";
import Link from "next/link";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

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
    type: "BUY" | "SELL" | "DEPOSIT" | "WITHDRAW";
    shares?: number;
    price?: number;
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

// Generate some mock chart data based on current value for visual appeal
// In a real app, this would come from historical snapshots
const generateChartData = (currentValue: number, balance: number) => {
    const data = [];
    const total = currentValue + balance;
    let val = total * 0.9; // Start 10% lower
    const points = 7;

    for (let i = 0; i < points; i++) {
        val = val * (1 + (Math.random() * 0.05 - 0.01)); // Random daily movement
        if (i === points - 1) val = total; // End at current

        const d = new Date();
        d.setDate(d.getDate() - (points - 1 - i));

        data.push({
            date: d.toLocaleDateString('en-US', { weekday: 'short' }),
            value: val
        });
    }
    return data;
};

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
            <div className="min-h-screen flex items-center justify-center text-[var(--text-muted)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p>Loading your portfolio...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const chartData = generateChartData(data.currentValue, data.balance);

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case "DEPOSIT": return <Wallet size={16} />;
            case "WITHDRAW": return <ArrowUpRight size={16} />;
            case "BUY": return <ArrowDownLeft size={16} />;
            case "SELL": return <ArrowUpRight size={16} />;
            default: return <Activity size={16} />;
        }
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case "DEPOSIT": return "bg-indigo-500/10 text-indigo-500";
            case "WITHDRAW": return "bg-red-500/10 text-red-500";
            case "BUY": return "bg-emerald-500/10 text-emerald-500";
            case "SELL": return "bg-amber-500/10 text-amber-500";
            default: return "bg-[var(--bg-secondary)] text-[var(--text-secondary)]";
        }
    };

    const getTransactionTitle = (tx: Transaction) => {
        switch (tx.type) {
            case "DEPOSIT": return "Deposit";
            case "WITHDRAW": return "Withdraw";
            case "BUY": return `Bought ${tx.symbol}`;
            case "SELL": return `Sold ${tx.symbol}`;
            default: return "Transaction";
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
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

            {/* Main Stats Area with Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Visual Portfolio Card */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[var(--text-secondary)] text-sm font-medium mb-1">Total Net Worth</p>
                            <h2 className="text-4xl font-extrabold text-[var(--text-primary)]">
                                {formatCurrency(data.currentValue + data.balance)}
                            </h2>
                        </div>
                        <div className={`text-right ${data.totalGainLoss >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                            <p className="text-lg font-bold flex items-center justify-end gap-1">
                                {data.totalGainLoss >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                {formatCurrency(Math.abs(data.totalGainLoss))}
                            </p>
                            <p className="text-xs font-semibold opacity-80">All time return</p>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{
                                        background: "var(--bg-card)",
                                        border: "1px solid var(--border-color)",
                                        borderRadius: 12,
                                        fontSize: 13,
                                        color: "var(--text-primary)",
                                    }}
                                    formatter={(value: unknown) => [formatCurrency(Number(value)), "Net Worth"]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side Stats */}
                <div className="flex flex-col gap-6">
                    <div className="flex-1 p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]">
                            <Wallet size={20} />
                            <span className="text-sm font-medium">Buying Power</span>
                        </div>
                        <div className="text-3xl font-bold text-[var(--text-primary)]">
                            {formatCurrency(data.balance)}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">Available to trade</p>
                    </div>

                    <div className="flex-1 p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]">
                            <PieChart size={20} />
                            <span className="text-sm font-medium">Invested Assets</span>
                        </div>
                        <div className="text-3xl font-bold text-[var(--text-primary)]">
                            {formatCurrency(data.currentValue)}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">{data.portfolio.length} active positions</p>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Assets List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Your Portfolio</h2>
                    {data.portfolio.length === 0 ? (
                        <div className="p-12 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] text-center">
                            <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--text-secondary)]">
                                <Briefcase size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">No stocks yet</h3>
                            <p className="text-[var(--text-secondary)] mb-6">Your portfolio is looking a bit empty.</p>
                            <Link href="/stocks" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors">
                                Explore Market
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {data.portfolio.map((item) => (
                                <Link href={`/stocks/${item.stockId}`} key={item.stockId} className="group flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center font-bold text-lg text-[var(--text-primary)] group-hover:bg-indigo-500 group-hover:text-white transition-colors">
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

                {/* Activity Feed */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Recent Activity</h2>
                    <div className="space-y-4">
                        {data.recentActivity.map((tx) => (
                            <div key={tx._id} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${getTransactionColor(tx.type)}`}>
                                        {getTransactionIcon(tx.type)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-[var(--text-primary)]">
                                            {getTransactionTitle(tx)}
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
                                        {tx.shares ? `${tx.shares.toFixed(4)} shares` : "Completed"}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {data.recentActivity.length === 0 && (
                            <div className="text-center text-[var(--text-muted)] py-8 border border-dashed border-[var(--border-color)] rounded-2xl">
                                No recent activity
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
