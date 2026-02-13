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
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
                    Stocks
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                    Explore and invest in fractional shares of top companies.
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div
                    style={{
                        flex: 1,
                        minWidth: 240,
                        position: "relative",
                    }}
                >
                    <Search
                        size={18}
                        style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                    />
                    <input
                        type="text"
                        placeholder="Search stocks..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px 14px 12px 42px",
                            borderRadius: 12,
                            border: "1px solid var(--border-color)",
                            background: "var(--bg-card)",
                            color: "var(--text-primary)",
                            fontSize: 14,
                            outline: "none",
                        }}
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "1px solid var(--border-color)",
                        background: "var(--bg-card)",
                        color: "var(--text-secondary)",
                        fontSize: 14,
                        cursor: "pointer",
                        fontWeight: 500,
                    }}
                >
                    <SlidersHorizontal size={16} />
                    Filters
                </button>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="card animate-fade-in" style={{ padding: 20, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>Risk:</span>
                        {(["All", "Low", "Medium", "High"] as RiskFilter[]).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRiskFilter(r)}
                                style={{
                                    padding: "6px 14px",
                                    borderRadius: 8,
                                    border: "1px solid var(--border-color)",
                                    background: riskFilter === r ? "var(--accent)" : "transparent",
                                    color: riskFilter === r ? "white" : "var(--text-secondary)",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: "pointer",
                                }}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortKey)}
                            style={{
                                padding: "6px 12px",
                                borderRadius: 8,
                                border: "1px solid var(--border-color)",
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)",
                                fontSize: 13,
                                outline: "none",
                            }}
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {filtered.map((stock, i) => (
                    <Link
                        href={`/stocks/${stock.id}`}
                        key={stock.id}
                        style={{ textDecoration: "none" }}
                    >
                        <div
                            className="card animate-fade-in-up"
                            style={{ padding: 20, cursor: "pointer", animationDelay: `${i * 0.03}s` }}
                        >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 12,
                                            background: "var(--bg-secondary)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 22,
                                        }}
                                    >
                                        {stock.logo}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                                            {stock.symbol}
                                        </div>
                                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                            {stock.name}
                                        </div>
                                    </div>
                                </div>
                                {/* Risk Badge */}
                                <span
                                    style={{
                                        padding: "4px 10px",
                                        borderRadius: 6,
                                        fontSize: 11,
                                        fontWeight: 600,
                                        background:
                                            stock.risk === "Low"
                                                ? "var(--green-bg)"
                                                : stock.risk === "Medium"
                                                    ? "var(--yellow-bg)"
                                                    : "var(--red-bg)",
                                        color:
                                            stock.risk === "Low"
                                                ? "var(--green)"
                                                : stock.risk === "Medium"
                                                    ? "var(--yellow)"
                                                    : "var(--red)",
                                    }}
                                >
                                    {stock.risk}
                                </span>
                            </div>

                            <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>
                                        {formatCurrency(stock.price)}
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 4,
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: stock.changePercent >= 0 ? "var(--green)" : "var(--red)",
                                            marginTop: 4,
                                        }}
                                    >
                                        {stock.changePercent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        {formatPercent(stock.changePercent)}
                                    </div>
                                </div>

                                {/* Growth Score */}
                                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "var(--yellow)" }}>
                                    <Star size={14} fill="currentColor" />
                                    {stock.growthScore}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: 48, color: "var(--text-muted)" }}>
                    No stocks found matching your criteria.
                </div>
            )}
        </div>
    );
}
