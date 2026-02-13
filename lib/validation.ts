import { z } from "zod";

export const signupSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone must be at least 10 digits").regex(/^\+?[\d\s-]+$/, "Invalid phone number"),
    dob: z.string().min(1, "Date of birth is required"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    bankAccount: z.string().min(8, "Bank account must be at least 8 digits").regex(/^\d+$/, "Must contain only digits"),
    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code (e.g., SBIN0001234)"),
    pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN (e.g., ABCDE1234F)"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[a-z]/, "Must contain a lowercase letter")
        .regex(/[0-9]/, "Must contain a number")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
    confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    remember: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[a-z]/, "Must contain a lowercase letter")
        .regex(/[0-9]/, "Must contain a number")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
    confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[a-z]/, "Must contain a lowercase letter")
        .regex(/[0-9]/, "Must contain a number")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
    confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const profileUpdateSchema = z.object({
    fullName: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
    address: z.string().min(5).optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
