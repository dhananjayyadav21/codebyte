import mongoose, { Schema, Document } from "mongoose";

export interface IPortfolio extends Document {
    userId: mongoose.Types.ObjectId;
    stockId: mongoose.Types.ObjectId;
    symbol: string;
    shares: number;
    averageBuyPrice: number;
}

const PortfolioSchema = new Schema<IPortfolio>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        stockId: { type: Schema.Types.ObjectId, ref: "Stock", required: true },
        symbol: { type: String, required: true },
        shares: { type: Number, required: true, default: 0 },
        averageBuyPrice: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

PortfolioSchema.index({ userId: 1, stockId: 1 }, { unique: true });

export default mongoose.models.Portfolio || mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
