import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    address: string;
    bankAccount: string;
    ifscCode: string;
    pan: string;
    password: string;
    role: "user" | "admin";
    isVerified: boolean;
    isBlocked: boolean;
    verificationToken: string | null;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
    loginAttempts: number;
    lockUntil: Date | null;
    lastLogin: Date | null;
    lastLoginIP: string | null;
    createdAt: Date;
    updatedAt: Date;
    balance: number;
}

const UserSchema = new Schema<IUser>(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, required: true, trim: true },
        dob: { type: String, required: true },
        address: { type: String, required: true, trim: true },
        bankAccount: { type: String, required: true, trim: true },
        ifscCode: { type: String, required: true, uppercase: true, trim: true },
        pan: { type: String, required: true, uppercase: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        isVerified: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
        verificationToken: { type: String, default: null },
        resetToken: { type: String, default: null },
        resetTokenExpiry: { type: Date, default: null },
        loginAttempts: { type: Number, default: 0 },
        lockUntil: { type: Date, default: null },
        lastLogin: { type: Date, default: null },
        lastLoginIP: { type: String, default: null },
        balance: { type: Number, default: 10000 },
    },
    { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ resetToken: 1 });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
