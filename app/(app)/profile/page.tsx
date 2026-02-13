"use client";

import { useEffect, useState } from "react";
import {
    User, Mail, Phone, MapPin, Calendar, CreditCard, Building, FileText, Shield,
    Edit3, Save, X, Lock, Eye, EyeOff, Activity, Clock, Globe, LogOut
} from "lucide-react";

interface UserData {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    address: string;
    bankAccount: string;
    ifscCode: string;
    pan: string;
    role: string;
    isVerified: boolean;
    lastLogin: string;
    lastLoginIP: string;
    createdAt: string;
}

interface LogEntry {
    _id: string;
    action: string;
    detail: string;
    ip: string;
    createdAt: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [tab, setTab] = useState<"info" | "security">("info");

    const [editForm, setEditForm] = useState({ fullName: "", phone: "", address: "" });
    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [pwError, setPwError] = useState("");

    useEffect(() => {
        fetchUser();
        fetchLogs();
    }, []);

    const showToast = (message: string, type: string = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setEditForm({ fullName: data.user.fullName, phone: data.user.phone, address: data.user.address });
            } else {
                window.location.href = "/login";
            }
        } catch {
            window.location.href = "/login";
        } finally {
            setLoading(false);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await fetch("/api/auth/activity");
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs);
            }
        } catch { /* ignore */ }
    };

    const handleSaveProfile = async () => {
        try {
            const res = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                setEditing(false);
                showToast("Profile updated successfully");
            } else {
                showToast(data.error || "Update failed", "error");
            }
        } catch {
            showToast("Network error", "error");
        }
    };

    const handleChangePassword = async () => {
        setPwError("");
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            setPwError("Passwords do not match");
            return;
        }
        try {
            const res = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pwForm),
            });
            const data = await res.json();
            if (res.ok) {
                setChangingPassword(false);
                setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                showToast("Password changed successfully");
                fetchLogs();
            } else {
                setPwError(data.error || "Failed to change password");
            }
        } catch {
            setPwError("Network error");
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
    };

    if (loading) {
        return (
            <div className="p-8 flex justify-center">
                <div className="skeleton w-full max-w-3xl h-96" />
            </div>
        );
    }

    if (!user) return null;

    const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 4 };
    const valueStyle = { fontSize: 15, color: "var(--text-primary)", fontWeight: 500 };
    const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: 14, outline: "none" };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* Toast */}
            {toast.show && (
                <div className={`toast toast-${toast.type}`}>{toast.message}</div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">My Profile</h1>
                    <p className="text-sm text-[var(--text-secondary)]">Manage your account settings and security</p>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--red)] text-sm font-semibold hover:bg-[var(--red-bg)] transition-colors">
                    <LogOut size={16} /> Logout
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: User Card */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="card p-6 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-[var(--gradient-card)] flex items-center justify-center mb-4 shadow-lg ring-4 ring-[var(--bg-secondary)]">
                            <User size={40} color="white" />
                        </div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">{user.fullName}</h2>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">{user.email}</p>

                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            <span className={`text-[11px] px-3 py-1 rounded-full font-semibold ${user.isVerified ? "bg-[var(--green-bg)] text-[var(--green)]" : "bg-[var(--red-bg)] text-[var(--red)]"}`}>
                                {user.isVerified ? "Verified" : "Unverified"}
                            </span>
                            <span className="text-[11px] px-3 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)] font-semibold">
                                Member since {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        {!editing && (
                            <button onClick={() => setEditing(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--accent)] text-sm font-semibold hover:bg-[var(--bg-secondary)] transition-colors">
                                <Edit3 size={16} /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Column: Tabs & Content */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Tabs */}
                    <div className="flex gap-1 bg-[var(--bg-secondary)] rounded-xl p-1">
                        {[
                            { key: "info" as const, label: "Personal Info", icon: User },
                            { key: "security" as const, label: "Security", icon: Shield },
                        ].map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all ${tab === t.key ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm" : "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    }`}
                            >
                                <t.icon size={16} /> {t.label}
                            </button>
                        ))}
                    </div>

                    {tab === "info" && (
                        <div className="flex flex-col gap-6">
                            {/* Details */}
                            <div className="card p-6">
                                <h3 className="text-base font-bold text-[var(--text-primary)] mb-5">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { icon: User, label: "Full Name", value: user.fullName, key: "fullName", editable: true },
                                        { icon: Mail, label: "Email", value: user.email, key: "email", editable: false },
                                        { icon: Phone, label: "Phone", value: user.phone, key: "phone", editable: true },
                                        { icon: Calendar, label: "Date of Birth", value: user.dob, key: "dob", editable: false },
                                    ].map((f) => (
                                        <div key={f.key}>
                                            <div style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 4 }}>
                                                <f.icon size={12} /> {f.label}
                                            </div>
                                            {editing && f.editable ? (
                                                <input value={editForm[f.key as keyof typeof editForm] || ""} onChange={(e) => setEditForm({ ...editForm, [f.key]: e.target.value })} style={inputStyle} />
                                            ) : (
                                                <div style={valueStyle}>{f.value || "—"}</div>
                                            )}
                                        </div>
                                    ))}
                                    <div className="col-span-1 md:col-span-2">
                                        <div style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 4 }}>
                                            <MapPin size={12} /> Address
                                        </div>
                                        {editing ? (
                                            <textarea value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} rows={2} style={{ ...inputStyle, resize: "vertical" as const }} />
                                        ) : (
                                            <div style={valueStyle}>{user.address || "—"}</div>
                                        )}
                                    </div>
                                </div>

                                {editing && (
                                    <div className="flex gap-3 mt-6">
                                        <button onClick={handleSaveProfile} className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-none bg-[var(--gradient-card)] text-white font-semibold shadow-md hover:shadow-lg transition-all">
                                            <Save size={16} /> Save Changes
                                        </button>
                                        <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] font-semibold hover:bg-[var(--bg-secondary)] transition-colors">
                                            <X size={16} /> Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Financial Details */}
                            <div className="card p-6">
                                <h3 className="text-base font-bold text-[var(--text-primary)] mb-5">Financial Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { icon: FileText, label: "PAN", value: user.pan },
                                        { icon: CreditCard, label: "Bank Account", value: user.bankAccount ? "••••" + user.bankAccount.slice(-4) : "—" },
                                        { icon: Building, label: "IFSC Code", value: user.ifscCode },
                                    ].map((f) => (
                                        <div key={f.label}>
                                            <div style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 4 }}><f.icon size={12} /> {f.label}</div>
                                            <div style={valueStyle}>{f.value || "—"}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === "security" && (
                        <div className="flex flex-col gap-6">
                            {/* Change Password */}
                            <div className="card p-6">
                                <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">Change Password</h3>
                                <p className="text-sm text-[var(--text-secondary)] mb-5">Update your password regularly for better security.</p>

                                {!changingPassword ? (
                                    <button onClick={() => setChangingPassword(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-none bg-[var(--gradient-card)] text-white font-semibold shadow-md hover:shadow-lg transition-all">
                                        <Lock size={16} /> Change Password
                                    </button>
                                ) : (
                                    <div className="flex flex-col gap-4 max-w-md">
                                        {pwError && <div className="p-3 rounded-lg bg-[var(--red-bg)] text-[var(--red)] text-sm">{pwError}</div>}
                                        <div className="relative">
                                            <input type={showPassword ? "text" : "password"} placeholder="Current password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} style={inputStyle} />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        <input type="password" placeholder="New password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} style={inputStyle} />
                                        <input type="password" placeholder="Confirm new password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} style={inputStyle} />
                                        <div className="flex gap-3 mt-2">
                                            <button onClick={handleChangePassword} className="px-6 py-2.5 rounded-xl border-none bg-[var(--gradient-card)] text-white font-semibold hover:shadow-lg transition-all">Save</button>
                                            <button onClick={() => { setChangingPassword(false); setPwError(""); }} className="px-6 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] font-semibold hover:bg-[var(--bg-secondary)]">Cancel</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Session Info */}
                            <div className="card p-6">
                                <h3 className="text-base font-bold text-[var(--text-primary)] mb-5">Session Info</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> Last Login</div>
                                        <div style={valueStyle}>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "—"}</div>
                                    </div>
                                    <div>
                                        <div style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 4 }}><Globe size={12} /> IP Address</div>
                                        <div style={valueStyle}>{user.lastLoginIP || "—"}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Log */}
                            <div className="card p-6">
                                <h3 className="text-base font-bold text-[var(--text-primary)] mb-5 flex items-center gap-2">
                                    <Activity size={18} /> Security Activity
                                </h3>
                                {logs.length === 0 ? (
                                    <p className="text-sm text-[var(--text-muted)]">No activity yet.</p>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {logs.map((log) => (
                                            <div key={log._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-xl bg-[var(--bg-secondary)] text-sm gap-2">
                                                <div>
                                                    <span className="font-semibold text-[var(--text-primary)] capitalize">{log.action.replace("_", " ")}</span>
                                                    {log.detail && <span className="text-[var(--text-muted)] ml-2">— {log.detail}</span>}
                                                </div>
                                                <div className="text-[var(--text-muted)] text-xs whitespace-nowrap">
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
