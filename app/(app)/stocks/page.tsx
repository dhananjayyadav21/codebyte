"use client";

import { useEffect, useState } from "react";
import { formatPercent, formatCompact } from "@/lib/utils";
import { useCurrency } from "@/components/CurrencyProvider";
import Link from "next/link";
import {
    Search,
    TrendingUp,
    TrendingDown,
    Filter,
    ArrowUpRight,
    X,
    ChevronDown,
    Plus,
    ShoppingCart,
    Loader2,
    DollarSign,
    CheckCircle2,
} from "lucide-react";

interface Stock {
    _id: string;
    id?: string;
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    marketCap: number;
    volume: number;
    sector: string;
    risk: string;
    logo: string;
    aiRecommendation: string;
    availableShares?: number;
    totalShares?: number;
}

const SECTORS = ["All", "Technology", "Consumer Cyclical", "Healthcare", "Financial Services", "Entertainment", "Automotive"];
const RISK_LEVELS = ["All", "Low", "Medium", "High"];
const AI_RECS = ["All", "Strong Buy", "Buy", "Hold", "Risky"];
const SORT_OPTIONS = [
    { value: "default", label: "Default" },
    { value: "price-asc", label: "Price: Low → High" },
    { value: "price-desc", label: "Price: High → Low" },
    { value: "change-desc", label: "Top Gainers" },
    { value: "change-asc", label: "Top Losers" },
    { value: "mcap-desc", label: "Market Cap" },
];

export default function StocksPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSector, setSelectedSector] = useState("All");
    const [selectedRisk, setSelectedRisk] = useState("All");
    const [selectedRec, setSelectedRec] = useState("All");
    const [sortBy, setSortBy] = useState("default");
    const [showFilters, setShowFilters] = useState(false);
    const { formatPrice, currency } = useCurrency();

    // Role state
    const [isAdmin, setIsAdmin] = useState(false);
    const [userBalance, setUserBalance] = useState(0);

    // Quick Buy modal state (for regular users)
    const [buyModalStock, setBuyModalStock] = useState<Stock | null>(null);
    const [buyAmount, setBuyAmount] = useState("");
    const [isBuying, setIsBuying] = useState(false);
    const [buySuccess, setBuySuccess] = useState(false);

    useEffect(() => {
        // Fetch stocks
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

        // Function to fetch user data
        const fetchUserData = () => {
            fetch("/api/auth/me")
                .then((res) => res.json())
                .then((data) => {
                    if (data.user) {
                        setIsAdmin(data.user.role === "admin");
                        setUserBalance(data.user.balance || 0);
                    }
                })
                .catch(() => { });
        };

        // Initial fetch
        fetchUserData();

        // Refetch on window focus (e.g. returning from deposit page)
        const onFocus = () => fetchUserData();
        window.addEventListener("focus", onFocus);

        return () => window.removeEventListener("focus", onFocus);
    }, []);

    const activeFilterCount = [selectedSector, selectedRisk, selectedRec].filter(f => f !== "All").length + (sortBy !== "default" ? 1 : 0);

    const filteredStocks = stocks
        .filter((stock) => {
            const matchesSearch =
                stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                stock.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSector = selectedSector === "All" || stock.sector === selectedSector;
            const matchesRisk = selectedRisk === "All" || stock.risk === selectedRisk;
            const matchesRec = selectedRec === "All" || stock.aiRecommendation === selectedRec;
            return matchesSearch && matchesSector && matchesRisk && matchesRec;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "price-asc": return a.price - b.price;
                case "price-desc": return b.price - a.price;
                case "change-desc": return b.changePercent - a.changePercent;
                case "change-asc": return a.changePercent - b.changePercent;
                case "mcap-desc": return b.marketCap - a.marketCap;
                default: return 0;
            }
        });

    const clearFilters = () => {
        setSelectedSector("All");
        setSelectedRisk("All");
        setSelectedRec("All");
        setSortBy("default");
    };

    // Quick Buy handler (for regular users)
    const handleQuickBuy = async () => {
        if (!buyModalStock || !buyAmount || parseFloat(buyAmount) <= 0) return;
        setIsBuying(true);
        try {
            const res = await fetch("/api/trade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    stockId: buyModalStock._id,
                    type: "BUY",
                    amount: parseFloat(buyAmount),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Purchase failed");

            setBuySuccess(true);
            setUserBalance((prev) => prev - parseFloat(buyAmount));

            // Auto-close after 2s
            setTimeout(() => {
                setBuyModalStock(null);
                setBuyAmount("");
                setBuySuccess(false);
            }, 2000);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsBuying(false);
        }
    };

    const sharesToBuy = buyModalStock && buyAmount ? parseFloat(buyAmount) / buyModalStock.price : 0;

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

                <div className="flex gap-2 w-full md:w-auto items-center">
                    {/* Add Stock / Quick Buy Button */}
                    {isAdmin ? (
                        <Link
                            href="/admin/stocks/new"
                            className="px-4 py-2.5 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-600 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20 whitespace-nowrap"
                        >
                            <Plus size={18} /> Add Stock
                        </Link>
                    ) : (
                        <div className="text-xs font-medium text-[var(--text-secondary)] px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                            Balance: <span className="text-[var(--text-primary)] font-bold">{formatPrice(userBalance)}</span>
                        </div>
                    )}

                    {/* Search */}
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
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 relative ${showFilters ? "bg-indigo-500 text-white border-indigo-500" : "bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--border-color)]"}`}
                    >
                        <Filter size={18} />
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-lg animate-fade-in-up space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-[var(--text-primary)] text-sm">Filters & Sort</h3>
                        {activeFilterCount > 0 && (
                            <button onClick={clearFilters} className="text-xs text-indigo-500 font-semibold hover:underline">
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Sector */}
                        <div>
                            <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Sector</label>
                            <div className="relative">
                                <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)} className="w-full appearance-none px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium pr-8">
                                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                            </div>
                        </div>

                        {/* Risk */}
                        <div>
                            <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Risk Level</label>
                            <div className="relative">
                                <select value={selectedRisk} onChange={(e) => setSelectedRisk(e.target.value)} className="w-full appearance-none px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium pr-8">
                                    {RISK_LEVELS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                            </div>
                        </div>

                        {/* AI Rating */}
                        <div>
                            <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">AI Rating</label>
                            <div className="relative">
                                <select value={selectedRec} onChange={(e) => setSelectedRec(e.target.value)} className="w-full appearance-none px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium pr-8">
                                    {AI_RECS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Sort By</label>
                            <div className="relative">
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full appearance-none px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium pr-8">
                                    {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Active filter pills */}
                    {activeFilterCount > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {selectedSector !== "All" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 text-xs font-semibold">
                                    {selectedSector}
                                    <X size={12} className="cursor-pointer" onClick={() => setSelectedSector("All")} />
                                </span>
                            )}
                            {selectedRisk !== "All" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-semibold">
                                    {selectedRisk} Risk
                                    <X size={12} className="cursor-pointer" onClick={() => setSelectedRisk("All")} />
                                </span>
                            )}
                            {selectedRec !== "All" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
                                    {selectedRec}
                                    <X size={12} className="cursor-pointer" onClick={() => setSelectedRec("All")} />
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                <span>{filteredStocks.length} stocks found</span>
            </div>

            {/* Stocks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStocks.map((stock) => (
                    <div
                        key={stock._id}
                        className="group p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all flex flex-col justify-between"
                    >
                        {/* Clickable area for stock details */}
                        <Link href={`/stocks/${stock._id}`} className="block">
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
                                    {formatPrice(stock.price)}
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-semibold ${stock.changePercent >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                                    {stock.changePercent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    {formatPrice(Math.abs(stock.change))} ({formatPercent(stock.changePercent)})
                                </div>
                            </div>
                        </Link>

                        {/* Footer with AI badge + action button */}
                        <div className="mt-4 pt-4 border-t border-[var(--border-color)] space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-[var(--text-muted)]">Cap: {formatCompact(stock.marketCap)}</span>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider ${stock.aiRecommendation === 'Strong Buy' ? 'bg-emerald-500/10 text-emerald-500'
                                    : stock.aiRecommendation === 'Buy' ? 'bg-cyan-500/10 text-cyan-500'
                                        : stock.aiRecommendation === 'Hold' ? 'bg-yellow-500/10 text-yellow-500'
                                            : 'bg-red-500/10 text-red-500'}`}>
                                    {stock.aiRecommendation}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setBuyModalStock(stock);
                                        setBuyAmount("");
                                        setBuySuccess(false);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm"
                                >
                                    <ShoppingCart size={14} /> Buy Shares
                                </button>
                                {isAdmin && (
                                    <Link
                                        href="/admin/stocks/new"
                                        className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 text-xs font-bold hover:bg-indigo-500 hover:text-white transition-all"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Plus size={14} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredStocks.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-lg font-semibold text-[var(--text-primary)] mb-2">No stocks match your filters</p>
                    <p className="text-[var(--text-secondary)] mb-4">Try adjusting your search or filters</p>
                    <button onClick={clearFilters} className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors">
                        Clear Filters
                    </button>
                </div>
            )}

            {/* ───── Quick Buy Modal (Regular Users) ───── */}
            {buyModalStock && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                    <div className="w-full max-w-md rounded-3xl border border-[var(--border-color)] shadow-2xl overflow-hidden animate-fade-in-up" style={{ background: 'var(--bg-card)' }}>

                        {/* Success State */}
                        {buySuccess ? (
                            <div className="p-8 text-center space-y-4">
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 size={32} className="text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">Purchase Successful!</h3>
                                <p className="text-[var(--text-secondary)]">
                                    You bought <span className="font-bold text-[var(--text-primary)]">{sharesToBuy.toFixed(4)} shares</span> of{" "}
                                    <span className="font-bold text-indigo-500">{buyModalStock.symbol}</span>
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="relative px-6 pt-6 pb-4 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(99,102,241,0.05))' }}>
                                    <button
                                        onClick={() => setBuyModalStock(null)}
                                        className="absolute top-4 right-4 p-1.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-2xl border border-[var(--border-color)]">
                                        {buyModalStock.logo}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-extrabold text-[var(--text-primary)]">Buy {buyModalStock.symbol}</h3>
                                        <p className="text-xs text-[var(--text-secondary)]">{buyModalStock.name} • {formatPrice(buyModalStock.price)}/share</p>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="px-6 py-5 space-y-5">
                                    {/* Balance Info */}
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                                        <span className="text-xs font-medium text-[var(--text-secondary)]">Available Balance</span>
                                        <span className="font-bold text-[var(--text-primary)]">{formatPrice(userBalance)}</span>
                                    </div>

                                    {/* Amount Input */}
                                    <div>
                                        <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block">Amount to Invest ({currency === 'INR' ? '₹' : '$'})</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                                                {currency === 'INR' ? '₹' : '$'}
                                            </div>
                                            <input
                                                type="number"
                                                value={buyAmount}
                                                onChange={(e) => setBuyAmount(e.target.value)}
                                                placeholder="0.00"
                                                autoFocus
                                                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xl font-bold text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-[var(--text-muted)]"
                                            />
                                        </div>
                                    </div>

                                    {/* Quick Amounts */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {[50, 100, 500, 1000].map(amt => (
                                            <button
                                                key={amt}
                                                onClick={() => setBuyAmount(Math.min(amt, userBalance).toString())}
                                                className={`py-2 rounded-lg text-xs font-bold transition-all border ${buyAmount === amt.toString()
                                                    ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                                                    : "bg-[var(--bg-secondary)] border-transparent text-[var(--text-secondary)] hover:bg-[var(--border-color)]"
                                                    }`}
                                            >
                                                {currency === 'INR' ? '₹' : '$'}{amt}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Preview */}
                                    {buyAmount && parseFloat(buyAmount) > 0 && (
                                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2 animate-fade-in">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[var(--text-secondary)]">Shares You'll Get</span>
                                                <span className="font-bold text-[var(--text-primary)]">{sharesToBuy.toFixed(4)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[var(--text-secondary)]">Price per Share</span>
                                                <span className="font-bold text-[var(--text-primary)]">{formatPrice(buyModalStock.price)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm pt-2 border-t border-emerald-500/10">
                                                <span className="text-[var(--text-secondary)]">Total Cost</span>
                                                <span className="font-bold text-emerald-500">{formatPrice(parseFloat(buyAmount))}</span>
                                            </div>
                                            {parseFloat(buyAmount) > userBalance && (
                                                <p className="text-xs text-red-500 font-semibold mt-1">⚠️ Insufficient balance</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="px-6 pb-6 flex gap-3">
                                    <button
                                        onClick={() => setBuyModalStock(null)}
                                        className="flex-1 py-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold text-sm hover:bg-[var(--border-color)] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleQuickBuy}
                                        disabled={isBuying || !buyAmount || parseFloat(buyAmount) <= 0 || parseFloat(buyAmount) > userBalance}
                                        className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isBuying ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
                                        {isBuying ? "Processing..." : "Buy Shares"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
