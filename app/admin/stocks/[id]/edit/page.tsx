"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FormData {
    symbol: string;
    name: string;
    price: string;
    totalShares: string;
    marketCap: string;
    description: string;
    growthScore: string;
    risk: string;
    sector: string;
}

export default function EditStockPage() {
    const router = useRouter();
    const params = useParams();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        symbol: "",
        name: "",
        price: "",
        totalShares: "",
        marketCap: "",
        description: "",
        growthScore: "50",
        risk: "Medium",
        sector: ""
    });

    useEffect(() => {
        if (!params.id) return;

        fetch(`/api/stocks/${params.id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Stock not found");
                return res.json();
            })
            .then((data) => {
                setFormData({
                    symbol: data.symbol,
                    name: data.name,
                    price: data.price.toString(),
                    totalShares: data.totalShares.toString(),
                    marketCap: data.marketCap?.toString() || "",
                    description: data.description || "",
                    growthScore: data.growthScore?.toString() || "50",
                    risk: data.risk || "Medium",
                    sector: data.sector || ""
                });
                setLoading(false);
            })
            .catch((err) => {
                showToast("Failed to fetch stock details", "error");
                router.push("/admin/stocks");
            });
    }, [params.id, router, showToast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const payload = {
                _id: params.id,
                ...formData,
                price: parseFloat(formData.price),
                totalShares: parseFloat(formData.totalShares),
                marketCap: parseFloat(formData.marketCap || "0"),
                growthScore: parseFloat(formData.growthScore)
            };

            const res = await fetch("/api/admin/stocks", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update stock");

            showToast(`Stock ${data.symbol} updated successfully!`, "success");
            router.push("/admin/stocks");
            router.refresh();

        } catch (error: any) {
            showToast(error.message, "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <Link href="/admin/stocks" className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Stocks
            </Link>

            <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Stock: {formData.symbol}</h1>
                <p className="text-gray-500">Update stock details and inventory.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Symbol</label>
                        <input
                            type="text"
                            name="symbol"
                            required
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 uppercase font-mono cursor-not-allowed"
                            value={formData.symbol}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Company Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            required
                            min="0.01"
                            step="0.01"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Total Shares (Inventory)</label>
                        <input
                            type="number"
                            name="totalShares"
                            required
                            min="1"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            value={formData.totalShares}
                            onChange={handleChange}
                        />
                        <p className="text-xs text-gray-400">Updating this increases available shares.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Market Cap ($)</label>
                        <input
                            type="number"
                            name="marketCap"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            value={formData.marketCap}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Description</label>
                    <textarea
                        name="description"
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Risk Level</label>
                        <select
                            name="risk"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            value={formData.risk}
                            onChange={handleChange}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Sector</label>
                        <input
                            type="text"
                            name="sector"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            value={formData.sector}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Growth Score (0-100)</label>
                        <input
                            type="number"
                            name="growthScore"
                            min="0"
                            max="100"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            value={formData.growthScore}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Update Stock</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
