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
            <div style={{ padding: 32, display: "flex", justifyContent: "center" }}>
                <div className="skeleton" style={{ width: "100%", maxWidth: 700, height: 400 }} />
            </div>
        );
    }

    if (!user) return null;

    const cardStyle = { background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border-color)", padding: 24, marginBottom: 20 };
    const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 4 };
    const valueStyle = { fontSize: 15, color: "var(--text-primary)", fontWeight: 500 };
    const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: 14, outline: "none" };

    return (
        <div style={{ padding: "24px 32px", maxWidth: 800, margin: "0 auto" }}>
            {/* Toast */}
            {toast.show && (
                <div className={`toast toast-${toast.type}`}>{toast.message}</div>
            )}

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)" }}>My Profile</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Manage your account settings and security</p>
                </div>
                <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--red)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                    <LogOut size={16} /> Logout
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "var(--bg-secondary)", borderRadius: 12, padding: 4 }}>
                {[
                    { key: "info" as const, label: "Personal Info", icon: User },
                    { key: "security" as const, label: "Security", icon: Shield },
                ].map((t) => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, padding: "10px 16px", borderRadius: 10, border: "none", background: tab === t.key ? "var(--bg-card)" : "transparent", color: tab === t.key ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: tab === t.key ? "var(--shadow-sm)" : "none", transition: "all 0.2s" }}>
                        <t.icon size={16} /> {t.label}
                    </button>
                ))}
            </div>

            {tab === "info" && (
                <>
                    {/* User Card */}
                    <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 20 }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--gradient-card)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <User size={28} color="white" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>{user.fullName}</h2>
                            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{user.email}</p>
                            <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                                <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 20, background: user.isVerified ? "var(--green-bg)" : "var(--red-bg)", color: user.isVerified ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
                                    {user.isVerified ? "Verified" : "Unverified"}
                                </span>
                                <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 20, background: "var(--bg-secondary)", color: "var(--text-muted)", fontWeight: 600 }}>
                                    Member since {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        {!editing && (
                            <button onClick={() => setEditing(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--accent)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                                <Edit3 size={14} /> Edit
                            </button>
                        )}
                    </div>

                    {/* Details */}
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>Personal Information</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
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
                            <div style={{ gridColumn: "1 / -1" }}>
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
                            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                                <button onClick={handleSaveProfile} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 10, border: "none", background: "var(--gradient-card)", color: "white", fontWeight: 600, cursor: "pointer" }}>
                                    <Save size={16} /> Save
                                </button>
                                <button onClick={() => setEditing(false)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-secondary)", fontWeight: 600, cursor: "pointer" }}>
                                    <X size={16} /> Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Financial Details (read-only) */}
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>Financial Information</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
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
                </>
            )}

            {tab === "security" && (
                <>
                    {/* Change Password */}
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Change Password</h3>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>Update your password regularly for better security.</p>

                        {!changingPassword ? (
                            <button onClick={() => setChangingPassword(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 10, border: "none", background: "var(--gradient-card)", color: "white", fontWeight: 600, cursor: "pointer" }}>
                                <Lock size={16} /> Change Password
                            </button>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
                                {pwError && <div style={{ padding: "10px 14px", borderRadius: 10, background: "var(--red-bg)", color: "var(--red)", fontSize: 13 }}>{pwError}</div>}
                                <div style={{ position: "relative" }}>
                                    <input type={showPassword ? "text" : "password"} placeholder="Current password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} style={inputStyle} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                </div>
                                <input type="password" placeholder="New password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} style={inputStyle} />
                                <input type="password" placeholder="Confirm new password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} style={inputStyle} />
                                <div style={{ display: "flex", gap: 12 }}>
                                    <button onClick={handleChangePassword} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "var(--gradient-card)", color: "white", fontWeight: 600, cursor: "pointer" }}>Save</button>
                                    <button onClick={() => { setChangingPassword(false); setPwError(""); }} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-secondary)", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Last Login */}
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>Session Info</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                            <Activity size={18} /> Security Activity
                        </h3>
                        {logs.length === 0 ? (
                            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No activity yet.</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {logs.map((log) => (
                                    <div key={log._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 10, background: "var(--bg-secondary)", fontSize: 13 }}>
                                        <div>
                                            <span style={{ fontWeight: 600, color: "var(--text-primary)", textTransform: "capitalize" }}>{log.action.replace("_", " ")}</span>
                                            {log.detail && <span style={{ color: "var(--text-muted)", marginLeft: 8 }}>— {log.detail}</span>}
                                        </div>
                                        <div style={{ color: "var(--text-muted)", fontSize: 12, whiteSpace: "nowrap" }}>
                                            {new Date(log.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
