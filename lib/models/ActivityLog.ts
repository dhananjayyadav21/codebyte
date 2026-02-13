import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
    userId: mongoose.Types.ObjectId;
    action: string;
    detail: string;
    ip: string;
    userAgent: string;
    createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        action: { type: String, required: true },
        detail: { type: String, default: "" },
        ip: { type: String, default: "unknown" },
        userAgent: { type: String, default: "unknown" },
    },
    { timestamps: true }
);

ActivityLogSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
