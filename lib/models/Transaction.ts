import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    stockId?: mongoose.Types.ObjectId;
    symbol?: string; // Denormalized for easy display
    type: "BUY" | "SELL" | "DEPOSIT" | "WITHDRAW";
    shares?: number;
    price?: number;
    totalAmount: number;
    date: Date;
    status: "PENDING" | "COMPLETED" | "FAILED";
}

const TransactionSchema = new Schema<ITransaction>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        stockId: { type: Schema.Types.ObjectId, ref: "Stock", required: false },
        symbol: { type: String, required: false },
        type: { type: String, enum: ["BUY", "SELL", "DEPOSIT", "WITHDRAW"], required: true },
        shares: { type: Number, required: false },
        price: { type: Number, required: false },
        totalAmount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        status: { type: String, enum: ["PENDING", "COMPLETED", "FAILED"], default: "COMPLETED" },
    },
    { timestamps: true }
);

TransactionSchema.index({ userId: 1, date: -1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
