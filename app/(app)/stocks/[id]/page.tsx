"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { stocks } from "@/lib/mock-data";
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
} from "lucide-react";
import Link from "next/link";

export default function StockDetailPage() {
    const params = useParams();
    const stock = stocks.find((s) => s.id === params.id);
    const { showToast } = useToast();
    const [buyAmount, setBuyAmount] = useState("");

    if (!stock) {
        return (
            <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
                Stock not found.{" "}
                <Link href="/stocks" style={{ color: "var(--accent)" }}>Go back</Link>
            </div>
        );
    }

    const shares = buyAmount ? parseFloat(buyAmount) / stock.price : 0;
    const simReturn1y = buyAmount ? parseFloat(buyAmount) * (stock.growthScore / 100) * 0.3 : 0;

    const recColor =
        stock.aiRecommendation === "Strong Buy"
            ? "var(--green)"
            : stock.aiRecommendation === "Buy"
                ? "#06b6d4"
                : stock.aiRecommendation === "Hold"
                    ? "var(--yellow)"
                    : "var(--red)";

    const recBg =
        stock.aiRecommendation === "Strong Buy"
            ? "var(--green-bg)"
            : stock.aiRecommendation === "Buy"
                ? "#06b6d418"
                : stock.aiRecommendation === "Hold"
                    ? "var(--yellow-bg)"
                    : "var(--red-bg)";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Back + Header */}
            <Link
                href="/stocks"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 500,
                }}
            >
                <ArrowLeft size={16} /> Back to Stocks
            </Link>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 16,
                            background: "var(--bg-secondary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                        }}
                    >
                        {stock.logo}
                    </div>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)" }}>
                            {stock.symbol}
                        </h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{stock.name}</p>
                    </div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)" }}>
                        {formatCurrency(stock.price)}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            justifyContent: "flex-end",
                            color: stock.changePercent >= 0 ? "var(--green)" : "var(--red)",
                            fontWeight: 600,
                            fontSize: 15,
                        }}
                    >
                        {stock.changePercent >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {formatCurrency(Math.abs(stock.change))} ({formatPercent(stock.changePercent)})
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
                    Price History (90 days)
                </h3>
                <ResponsiveContainer width="100%" height={320}>
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
                        />
                        <YAxis
                            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `$${v}`}
                            width={65}
                            domain={["auto", "auto"]}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--border-color)",
                                borderRadius: 12,
                                fontSize: 13,
                                color: "var(--text-primary)",
                            }}
                            formatter={(value: unknown) => [formatCurrency(Number(value)), "Price"]}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#6366f1"
                            strokeWidth={2.5}
                            fill="url(#colorPrice)"
                            activeDot={{ r: 5, fill: "#6366f1" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Info Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                {/* Fundamentals */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
                        Fundamentals
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {[
                            { label: "Market Cap", value: formatCompact(stock.marketCap), tooltip: "Total market value of the company" },
                            { label: "P/E Ratio", value: stock.pe.toFixed(1), tooltip: "Price relative to earnings — lower may mean undervalued" },
                            { label: "EPS", value: `$${stock.eps.toFixed(2)}`, tooltip: "Earnings per share — company profit per stock unit" },
                            { label: "52W High", value: formatCurrency(stock.high52w), tooltip: "Highest price in the past year" },
                            { label: "52W Low", value: formatCurrency(stock.low52w), tooltip: "Lowest price in the past year" },
                            { label: "Volume", value: formatCompact(stock.volume), tooltip: "Number of shares traded today" },
                            { label: "Dividend", value: stock.dividend > 0 ? `$${stock.dividend.toFixed(2)}` : "None", tooltip: "Cash paid to shareholders per share" },
                            { label: "Sector", value: stock.sector, tooltip: "Industry category" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-color)" }}
                            >
                                <div>
                                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item.label}</span>
                                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.tooltip}</div>
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI + Risk + Buy */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* AI Recommendation */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <Sparkles size={18} color="var(--accent)" />
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                                AI Recommendation
                            </h3>
                        </div>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "10px 20px",
                                borderRadius: 12,
                                background: recBg,
                                color: recColor,
                                fontWeight: 700,
                                fontSize: 16,
                                marginBottom: 12,
                            }}
                        >
                            {stock.aiRecommendation === "Risky" ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
                            {stock.aiRecommendation}
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                            {stock.description}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 14, fontWeight: 600, color: "var(--yellow)" }}>
                            <Star size={16} fill="currentColor" />
                            Growth Score: {stock.growthScore}/100
                        </div>
                    </div>

                    {/* Buy Calculator */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <Calculator size={18} color="var(--accent)" />
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                                Fractional Buy Calculator
                            </h3>
                        </div>
                        <div style={{ position: "relative", marginBottom: 12 }}>
                            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 16, fontWeight: 600 }}>$</span>
                            <input
                                type="number"
                                placeholder="Enter amount"
                                value={buyAmount}
                                onChange={(e) => setBuyAmount(e.target.value)}
                                min="1"
                                style={{
                                    width: "100%",
                                    padding: "14px 14px 14px 32px",
                                    borderRadius: 12,
                                    border: "1px solid var(--border-color)",
                                    background: "var(--bg-primary)",
                                    color: "var(--text-primary)",
                                    fontSize: 16,
                                    outline: "none",
                                }}
                            />
                        </div>
                        {buyAmount && parseFloat(buyAmount) > 0 && (
                            <div className="animate-fade-in" style={{ marginBottom: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}>
                                    <span style={{ color: "var(--text-secondary)" }}>You&apos;ll get</span>
                                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{shares.toFixed(4)} shares</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}>
                                    <span style={{ color: "var(--text-secondary)" }}>Est. 1Y return</span>
                                    <span style={{ fontWeight: 600, color: "var(--green)" }}>+{formatCurrency(simReturn1y)}</span>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => {
                                if (!buyAmount || parseFloat(buyAmount) <= 0) return;
                                showToast(`Bought ${shares.toFixed(4)} shares of ${stock.symbol} for $${buyAmount}!`, "success");
                                setBuyAmount("");
                            }}
                            style={{
                                width: "100%",
                                padding: 14,
                                borderRadius: 12,
                                border: "none",
                                background: "var(--gradient-card)",
                                color: "white",
                                fontSize: 15,
                                fontWeight: 700,
                                cursor: "pointer",
                            }}
                        >
                            Buy {stock.symbol}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
