"use client";

import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart as RPieChart,
    Pie,
    Cell,
} from "recharts";
import { portfolioHoldings, recentActivity, portfolioHistory } from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/utils";

const totalValue = portfolioHoldings.reduce((s, h) => s + h.shares * h.currentPrice, 0);
const totalCost = portfolioHoldings.reduce((s, h) => s + h.shares * h.avgPrice, 0);
const totalPL = totalValue - totalCost;
const totalPLPercent = ((totalPL / totalCost) * 100);

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

const pieData = portfolioHoldings.map((h) => ({
    name: h.symbol,
    value: Math.round(h.shares * h.currentPrice * 100) / 100,
}));

const statCards = [
    {
        label: "Portfolio Value",
        value: formatCurrency(totalValue),
        icon: Wallet,
        color: "#6366f1",
        bg: "#6366f118",
    },
    {
        label: "Total Profit/Loss",
        value: formatCurrency(totalPL),
        sub: formatPercent(totalPLPercent),
        icon: totalPL >= 0 ? TrendingUp : TrendingDown,
        color: totalPL >= 0 ? "#10b981" : "#ef4444",
        bg: totalPL >= 0 ? "#10b98118" : "#ef444418",
    },
    {
        label: "Today's Change",
        value: "+$124.56",
        sub: "+1.42%",
        icon: TrendingUp,
        color: "#10b981",
        bg: "#10b98118",
    },
    {
        label: "Holdings",
        value: portfolioHoldings.length.toString(),
        icon: PieChart,
        color: "#8b5cf6",
        bg: "#8b5cf618",
    },
];

export default function DashboardPage() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
                    Dashboard
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                    Welcome back! Here&apos;s your portfolio overview.
                </p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                {statCards.map((card, i) => (
                    <div
                        key={i}
                        className="card animate-fade-in-up"
                        style={{ padding: 20, animationDelay: `${i * 0.05}s` }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
                                {card.label}
                            </span>
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    background: card.bg,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <card.icon size={18} color={card.color} />
                            </div>
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>
                            {card.value}
                        </div>
                        {card.sub && (
                            <span style={{ fontSize: 13, fontWeight: 600, color: card.color }}>
                                {card.sub}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }} className="lg:!grid-cols-[2fr_1fr]">
                {/* Line Chart */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>
                        Portfolio Growth
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={portfolioHistory}>
                            <XAxis
                                dataKey="date"
                                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) => {
                                    const d = new Date(v);
                                    return `${d.getMonth() + 1}/${d.getDate()}`;
                                }}
                                interval={14}
                            />
                            <YAxis
                                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                                width={55}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: 12,
                                    fontSize: 13,
                                    color: "var(--text-primary)",
                                }}
                                formatter={(value: unknown) => [formatCurrency(Number(value)), "Value"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#6366f1"
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5, fill: "#6366f1" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Donut Chart */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>
                        Allocation
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <RPieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {pieData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: 12,
                                    fontSize: 13,
                                    color: "var(--text-primary)",
                                }}
                                formatter={(value: unknown) => [formatCurrency(Number(value)), ""]}
                            />
                        </RPieChart>
                    </ResponsiveContainer>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                        {pieData.map((d, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length] }} />
                                {d.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Holdings + Recent Activity */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }} className="lg:!grid-cols-[1.5fr_1fr]">
                {/* Holdings */}
                <div className="card" style={{ padding: 24, overflow: "auto" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
                        Your Holdings
                    </h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                                <th style={{ textAlign: "left", padding: "8px 0", color: "var(--text-muted)", fontWeight: 500, fontSize: 12 }}>Stock</th>
                                <th style={{ textAlign: "right", padding: "8px 0", color: "var(--text-muted)", fontWeight: 500, fontSize: 12 }}>Shares</th>
                                <th style={{ textAlign: "right", padding: "8px 0", color: "var(--text-muted)", fontWeight: 500, fontSize: 12 }}>Value</th>
                                <th style={{ textAlign: "right", padding: "8px 0", color: "var(--text-muted)", fontWeight: 500, fontSize: 12 }}>P/L</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolioHoldings.map((h) => {
                                const value = h.shares * h.currentPrice;
                                const cost = h.shares * h.avgPrice;
                                const pl = value - cost;
                                const plPct = ((pl / cost) * 100);
                                return (
                                    <tr key={h.stockId} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                        <td style={{ padding: "12px 0" }}>
                                            <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{h.symbol}</div>
                                            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{h.name}</div>
                                        </td>
                                        <td style={{ textAlign: "right", color: "var(--text-secondary)" }}>{h.shares}</td>
                                        <td style={{ textAlign: "right", fontWeight: 600, color: "var(--text-primary)" }}>
                                            {formatCurrency(value)}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <span style={{ color: pl >= 0 ? "var(--green)" : "var(--red)", fontWeight: 600, fontSize: 13 }}>
                                                {formatPercent(plPct)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Recent Activity */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
                        Recent Activity
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {recentActivity.map((a) => (
                            <div
                                key={a.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "10px 0",
                                    borderBottom: "1px solid var(--border-color)",
                                }}
                            >
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 10,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background:
                                            a.type === "buy"
                                                ? "var(--green-bg)"
                                                : a.type === "sell"
                                                    ? "var(--red-bg)"
                                                    : "var(--yellow-bg)",
                                    }}
                                >
                                    {a.type === "buy" ? (
                                        <ArrowUpRight size={18} color="var(--green)" />
                                    ) : a.type === "sell" ? (
                                        <ArrowDownRight size={18} color="var(--red)" />
                                    ) : (
                                        <DollarSign size={18} color="var(--yellow)" />
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                                        {a.type === "buy" ? "Bought" : a.type === "sell" ? "Sold" : "Dividend"} {a.symbol}
                                    </div>
                                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                        {a.shares} shares • {a.date}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color:
                                            a.type === "buy"
                                                ? "var(--green)"
                                                : a.type === "sell"
                                                    ? "var(--red)"
                                                    : "var(--yellow)",
                                    }}
                                >
                                    {a.type === "sell" ? "+" : a.type === "buy" ? "-" : "+"}
                                    {formatCurrency(a.shares * a.price)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
