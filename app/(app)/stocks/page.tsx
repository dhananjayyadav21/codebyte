"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatPercent, formatCompact } from "@/lib/utils";
import Link from "next/link";
import {
    Search,
    TrendingUp,
    TrendingDown,
    Filter,
    ArrowUpRight,
} from "lucide-react";

interface Stock {
    _id: string;
    id?: string; // fallback
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    marketCap: number;
    volume: number;
    sector: string;
    logo: string;
    aiRecommendation: string;
}

export default function StocksPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSector, setSelectedSector] = useState("All");

    useEffect(() => {
        fetch("/api/stocks")
            .then((res) => res.json())
            .then((data) => {
                setStocks(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredStocks = stocks.filter((stock) => {
        const matchesSearch =
            stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stock.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSector =
            selectedSector === "All" || stock.sector === selectedSector;
        return matchesSearch && matchesSector;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-[var(--text-muted)]">
                <div className="animate-pulse">Loading market data...</div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Market</h1>
                    <p className="text-[var(--text-secondary)]">Explore and trade US stocks & ETFs</p>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                        <input
                            type="text"
                            placeholder="Search stocks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                        />
                    </div>
                    <button className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--border-color)]">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Stocks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStocks.map((stock) => (
                    <Link
                        href={`/stocks/${stock._id}`}
                        key={stock._id}
                        className="group p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all flex flex-col justify-between"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-xl">
                                    {stock.logo}
                                </div>
                                <div>
                                    <h3 className="font-bold text-[var(--text-primary)] group-hover:text-indigo-500 transition-colors">{stock.symbol}</h3>
                                    <p className="text-xs text-[var(--text-secondary)] truncate max-w-[100px]">{stock.name}</p>
                                </div>
                            </div>
                            <div className="p-1.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                <ArrowUpRight size={16} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-[var(--text-primary)]">
                                {formatCurrency(stock.price)}
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-semibold ${stock.changePercent >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                                {stock.changePercent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {formatCurrency(Math.abs(stock.change))} ({formatPercent(stock.changePercent)})
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                            <span>Cap: {formatCompact(stock.marketCap)}</span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider ${stock.aiRecommendation === 'Strong Buy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[var(--bg-secondary)]'}`}>
                                {stock.aiRecommendation}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
