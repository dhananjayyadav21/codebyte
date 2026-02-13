"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Users, Shield, CheckCircle, XCircle, Ban, Unlock, RotateCcw,
    Search, LogOut, ChevronDown
} from "lucide-react";

interface UserRow {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean;
    isBlocked: boolean;
    loginAttempts: number;
    lastLogin: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [resetModal, setResetModal] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const showToast = (message: string, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            } else {
                window.location.href = "/admin";
            }
        } catch {
            window.location.href = "/admin";
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (userId: string, action: string, extra?: object) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, ...extra }),
            });
            const data = await res.json();
            if (res.ok) {
                showToast(data.message);
                fetchUsers();
            } else {
                showToast(data.error || "Action failed", "error");
            }
        } catch {
            showToast("Network error", "error");
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/admin";
    };

    const filtered = users.filter((u) => {
        const matchSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        if (filter === "verified") return matchSearch && u.isVerified;
        if (filter === "unverified") return matchSearch && !u.isVerified;
        if (filter === "blocked") return matchSearch && u.isBlocked;
        return matchSearch;
    });

    const stats = {
        total: users.length,
        verified: users.filter((u) => u.isVerified).length,
        blocked: users.filter((u) => u.isBlocked).length,
        active: users.filter((u) => u.isVerified && !u.isBlocked).length,
    };

    const cardStyle = { background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border-color)", padding: 20 };

    if (loading) {
        return (
            <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
                <div className="skeleton" style={{ width: "100%", height: 500 }} />
            </div>
        );
    }

    return (
        <div style={{ padding: "24px 32px", maxWidth: 1200, margin: "0 auto", minHeight: "100vh" }}>
            {toast.show && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

            {/* Reset Password Modal */}
            {resetModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
                    <div style={{ ...cardStyle, width: 400, padding: 32 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>Reset User Password</h3>
                        <input type="text" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: 14, outline: "none", marginBottom: 16 }} />
                        <div style={{ display: "flex", gap: 12 }}>
                            <button onClick={() => { handleAction(resetModal, "reset-password", { newPassword }); setResetModal(null); setNewPassword(""); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "var(--gradient-card)", color: "white", fontWeight: 600, cursor: "pointer" }}>Reset</button>
                            <button onClick={() => { setResetModal(null); setNewPassword(""); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-secondary)", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--gradient-card)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Shield size={20} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>Admin Dashboard</h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Manage users and security</p>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <Link href="/dashboard" style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-secondary)", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>Main App</Link>
                    <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--red)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                    { label: "Total Users", value: stats.total, icon: Users, color: "var(--accent)" },
                    { label: "Verified", value: stats.verified, icon: CheckCircle, color: "var(--green)" },
                    { label: "Active", value: stats.active, icon: Unlock, color: "#3b82f6" },
                    { label: "Blocked", value: stats.blocked, icon: Ban, color: "var(--red)" },
                ].map((s) => (
                    <div key={s.label} style={cardStyle}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>{s.label}</p>
                                <p style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)" }}>{s.value}</p>
                            </div>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <s.icon size={20} style={{ color: s.color }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ ...cardStyle, marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1 }}>
                    <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%", padding: "10px 10px 10px 36px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: 13, outline: "none" }} />
                </div>
                <div style={{ position: "relative" }}>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ appearance: "none", padding: "10px 36px 10px 14px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: 13, fontWeight: 500, cursor: "pointer", outline: "none" }}>
                        <option value="all">All Users</option>
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                        <option value="blocked">Blocked</option>
                    </select>
                    <ChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                </div>
            </div>

            {/* Users Table */}
            <div style={{ ...cardStyle, overflow: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                            {["Name", "Email", "Phone", "Status", "Verified", "Last Login", "Actions"].map((h) => (
                                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 700, color: "var(--text-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((u) => (
                            <tr key={u._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                <td style={{ padding: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{u.fullName}</td>
                                <td style={{ padding: "14px", color: "var(--text-secondary)" }}>{u.email}</td>
                                <td style={{ padding: "14px", color: "var(--text-secondary)" }}>{u.phone}</td>
                                <td style={{ padding: "14px" }}>
                                    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: u.isBlocked ? "var(--red-bg)" : "var(--green-bg)", color: u.isBlocked ? "var(--red)" : "var(--green)" }}>
                                        {u.isBlocked ? "Blocked" : "Active"}
                                    </span>
                                </td>
                                <td style={{ padding: "14px" }}>
                                    {u.isVerified ? <CheckCircle size={16} style={{ color: "var(--green)" }} /> : <XCircle size={16} style={{ color: "var(--text-muted)" }} />}
                                </td>
                                <td style={{ padding: "14px", color: "var(--text-muted)", fontSize: 12 }}>
                                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never"}
                                </td>
                                <td style={{ padding: "14px" }}>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        {!u.isVerified && (
                                            <button onClick={() => handleAction(u._id, "verify")} title="Verify" style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--green)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <CheckCircle size={14} />
                                            </button>
                                        )}
                                        <button onClick={() => handleAction(u._id, "block")} title={u.isBlocked ? "Unblock" : "Block"} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: u.isBlocked ? "var(--green)" : "var(--red)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {u.isBlocked ? <Unlock size={14} /> : <Ban size={14} />}
                                        </button>
                                        <button onClick={() => setResetModal(u._id)} title="Reset Password" style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--accent)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <RotateCcw size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
