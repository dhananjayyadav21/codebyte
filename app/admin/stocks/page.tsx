"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatCompact } from "@/lib/utils";
import { Loader2, Plus, Search, Edit2, Trash2, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

interface Stock {
    _id: string;
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    totalShares: number;
    availableShares: number;
    marketCap: number;
}

export default function AdminStocksPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { showToast } = useToast();

    const fetchStocks = () => {
        fetch("/api/stocks")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setStocks(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    const handleDelete = async (id: string, symbol: string) => {
        if (!confirm(`Are you sure you want to delete ${symbol}? This action cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/admin/stocks?id=${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete stock");

            showToast(`${symbol} deleted successfully`, "success");
            setStocks(stocks.filter(s => s._id !== id));
        } catch (error) {
            showToast("Failed to delete stock", "error");
        }
    };

    const filteredStocks = stocks.filter(
        (s) =>
            s.symbol.toLowerCase().includes(search.toLowerCase()) ||
            s.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
                    <p className="text-gray-500">Manage market listings and inventory</p>
                </div>
                <Link href="/admin/stocks/new" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <Plus size={20} /> Add Stock
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-4">
                <div className="flex items-center gap-2 mb-4 bg-gray-50 rounded-xl px-4 py-2 w-full md:w-96">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search stocks..."
                        className="bg-transparent outline-none text-sm w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Symbol</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Inventory</th>
                                <th className="px-6 py-4">Market Cap</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-900">
                            {filteredStocks.map((stock) => {
                                const soldShares = stock.totalShares - stock.availableShares;
                                const ownership = (soldShares / stock.totalShares) * 100;

                                return (
                                    <tr key={stock._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-gray-900">{stock.symbol}</p>
                                                <p className="text-xs text-gray-500">{stock.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-mono font-medium">{formatCurrency(stock.price)}</div>
                                            <div className={`text-xs flex items-center gap-1 ${stock.changePercent >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                                {stock.changePercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                {stock.changePercent.toFixed(2)}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                    <span>Available</span>
                                                    <span className="font-bold text-gray-900">{formatCompact(stock.availableShares)}</span>
                                                </div>
                                                <div className="w-32 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                                    <div className={`h-full rounded-full ${ownership > 90 ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${100 - ownership}%` }} />
                                                </div>
                                                <div className="text-[10px] text-gray-400">Total: {formatCompact(stock.totalShares)}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {formatCompact(stock.marketCap)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/stocks/${stock._id}/edit`}
                                                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                                                    title="Edit Stock"
                                                >
                                                    <Edit2 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(stock._id, stock.symbol)}
                                                    className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                    title="Delete Stock"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredStocks.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No stocks found.</div>
                )}
            </div>
        </div>
    );
}
