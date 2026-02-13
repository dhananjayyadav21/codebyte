"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, TrendingUp, TrendingDown, Star } from "lucide-react";
import { stocks } from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/utils";

type SortKey = "price" | "change" | "growthScore" | "name";
type RiskFilter = "All" | "Low" | "Medium" | "High";

export default function StocksPage() {
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortKey>("growthScore");
    const [riskFilter, setRiskFilter] = useState<RiskFilter>("All");
    const [showFilters, setShowFilters] = useState(false);

    const filtered = stocks
        .filter((s) => {
            const match = s.name.toLowerCase().includes(query.toLowerCase()) || s.symbol.toLowerCase().includes(query.toLowerCase());
            const risk = riskFilter === "All" || s.risk === riskFilter;
            return match && risk;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "price": return b.price - a.price;
                case "change": return b.changePercent - a.changePercent;
                case "growthScore": return b.growthScore - a.growthScore;
                case "name": return a.name.localeCompare(b.name);
                default: return 0;
            }
        });

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mb-1">
                    Stocks
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                    Explore and invest in fractional shares of top companies.
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    />
                    <input
                        type="text"
                        placeholder="Search stocks..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full py-3 pl-10 pr-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--accent)] transition-colors"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--border-color)] text-sm font-medium transition-colors ${showFilters ? "bg-[var(--accent)] text-white border-transparent" : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                        }`}
                >
                    <SlidersHorizontal size={16} />
                    Filters
                </button>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="card p-5 animate-fade-in flex flex-col sm:flex-row gap-4 flex-wrap items-start sm:items-center">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Risk:</span>
                        {(["All", "Low", "Medium", "High"] as RiskFilter[]).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRiskFilter(r)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${riskFilter === r
                                    ? "bg-[var(--accent)] text-white border-transparent"
                                    : "bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]"
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortKey)}
                            className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs outline-none focus:border-[var(--accent)]"
                        >
                            <option value="growthScore">Growth Score</option>
                            <option value="price">Price</option>
                            <option value="change">Change %</option>
                            <option value="name">Name</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Stock Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((stock, i) => (
                    <Link
                        href={`/stocks/${stock.id}`}
                        key={stock.id}
                        className="no-underline block h-full"
                    >
                        <div
                            className="card p-5 cursor-pointer h-full hover:shadow-lg transition-transform hover:-translate-y-1 animate-fade-in-up flex flex-col justify-between"
                            style={{ animationDelay: `${i * 0.03}s` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-xl flex-shrink-0">
                                        {stock.logo}
                                    </div>
                                    <div>
                                        <div className="text-base font-bold text-[var(--text-primary)] leading-tight">
                                            {stock.symbol}
                                        </div>
                                        <div className="text-xs text-[var(--text-muted)] line-clamp-1">
                                            {stock.name}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${stock.risk === "Low"
                                    ? "bg-[var(--green-bg)] text-[var(--green)]"
                                    : stock.risk === "Medium"
                                        ? "bg-[var(--yellow-bg)] text-[var(--yellow)]"
                                        : "bg-[var(--red-bg)] text-[var(--red)]"
                                    }`}>
                                    {stock.risk}
                                </span>
                            </div>

                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-xl font-extrabold text-[var(--text-primary)]">
                                        {formatCurrency(stock.price)}
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs font-bold mt-1 ${stock.changePercent >= 0 ? "text-[var(--green)]" : "text-[var(--red)]"
                                        }`}>
                                        {stock.changePercent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        {formatPercent(stock.changePercent)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 text-xs font-bold text-[var(--yellow)] bg-[var(--yellow-bg)] px-2 py-1 rounded-md">
                                    <Star size={12} fill="currentColor" />
                                    {stock.growthScore}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-[var(--text-muted)]">
                    No stocks found matching your criteria.
                </div>
            )}
        </div>
    );
}
