import mongoose, { Schema, Document } from "mongoose";

export interface IStock extends Document {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    marketCap: number;
    volume: number;
    high52w: number;
    low52w: number;
    pe: number;
    eps: number;
    dividend: number;
    sector: string;
    risk: "Low" | "Medium" | "High";
    growthScore: number;
    aiRecommendation: "Strong Buy" | "Buy" | "Hold" | "Risky";
    description: string;
    history: { date: string; price: number }[];
    logo: string;
    totalShares: number; // Admin issued shares
    availableShares: number; // Remaining shares for users
}

const StockSchema = new Schema<IStock>(
    {
        symbol: { type: String, required: true, unique: true, uppercase: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        change: { type: Number, default: 0 },
        changePercent: { type: Number, default: 0 },
        marketCap: { type: Number, default: 0 },
        volume: { type: Number, default: 0 },
        high52w: { type: Number, default: 0 },
        low52w: { type: Number, default: 0 },
        pe: { type: Number, default: 0 },
        eps: { type: Number, default: 0 },
        dividend: { type: Number, default: 0 },
        sector: { type: String, default: "Technology" },
        risk: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
        growthScore: { type: Number, default: 50 },
        aiRecommendation: { type: String, enum: ["Strong Buy", "Buy", "Hold", "Risky"], default: "Hold" },
        description: { type: String, default: "" },
        history: [{ date: String, price: Number }],
        logo: { type: String, default: "📈" },
        totalShares: { type: Number, required: true, default: 1000000 },
        availableShares: { type: Number, required: true, default: 1000000 },
    },
    { timestamps: true }
);

// Force recompilation in dev
if (process.env.NODE_ENV === "development" && mongoose.models.Stock) {
    delete mongoose.models.Stock;
}

export default mongoose.models.Stock || mongoose.model<IStock>("Stock", StockSchema);
