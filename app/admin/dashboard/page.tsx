import { connectDB } from "@/lib/db";
import Stock from "@/lib/models/Stock";
import User from "@/lib/models/User";
import { formatCompact, formatCurrency } from "@/lib/utils";
import { Package, Users, TrendingUp, AlertTriangle } from "lucide-react";

async function getAdminStats() {
    await connectDB();
    const totalStocks = await Stock.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });

    // Calculate Inventory Value & Health
    const stocks = await Stock.find().select("price totalShares availableShares name symbol");

    let totalInventoryValue = 0; // Value of available shares
    let totalMarketCap = 0; // Value of all shares
    const lowStockItems = [];

    for (const s of stocks) {
        totalInventoryValue += s.availableShares * s.price;
        totalMarketCap += s.totalShares * s.price;

        if (s.availableShares < s.totalShares * 0.1) {
            lowStockItems.push(s);
        }
    }

    return {
        totalStocks,
        totalUsers,
        totalInventoryValue,
        totalMarketCap,
        lowStockItems,
        stocks
    };
}

export default async function AdminDashboard() {
    const stats = await getAdminStats();

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500">Platform overview and inventory status</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Stocks</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalStocks}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Inventory Value</p>
                            <h3 className="text-2xl font-bold text-gray-900">{formatCompact(stats.totalInventoryValue)}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Active Users</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Low Stock Alerts</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.lowStockItems.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Live Inventory</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Symbol</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Issued Shares</th>
                                <th className="px-6 py-4">Available</th>
                                <th className="px-6 py-4">Ownership</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-900">
                            {stats.stocks.map((stock: any) => {
                                const soldShares = stock.totalShares - stock.availableShares;
                                const ownership = (soldShares / stock.totalShares) * 100;
                                return (
                                    <tr key={stock._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold">{stock.symbol}</td>
                                        <td className="px-6 py-4">{formatCurrency(stock.price)}</td>
                                        <td className="px-6 py-4">{formatCompact(stock.totalShares)}</td>
                                        <td className="px-6 py-4 font-medium text-emerald-600">{formatCompact(stock.availableShares)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${ownership}%` }} />
                                                </div>
                                                <span className="text-xs text-gray-500">{ownership.toFixed(1)}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {stock.availableShares === 0 ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">Sold Out</span>
                                            ) : ownership > 80 ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-600">Low Stock</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600">Active</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
