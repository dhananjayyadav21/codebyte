"use client";

import { Menu, Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useCurrency } from "./CurrencyProvider";
import { Logo } from "./Logo";
import Link from "next/link";
import { useState, useEffect } from "react";

interface NavbarProps {
    onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    const { theme, toggleTheme } = useTheme();
    const { currency, setCurrency } = useCurrency();
    const [notifications, setNotifications] = useState<any[]>([]);

    const toggleCurrency = () => {
        setCurrency(currency === "INR" ? "USD" : "INR");
    };
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            const data = await res.json();
            if (data.notifications) {
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s

        // Listen for custom event to trigger immediate update
        const handleUpdate = () => fetchNotifications();
        window.addEventListener("notification-update", handleUpdate);

        return () => {
            clearInterval(interval);
            window.removeEventListener("notification-update", handleUpdate);
        };
    }, []);

    const markAsRead = async () => {
        if (unreadCount > 0) {
            try {
                await fetch("/api/notifications", { method: "PUT" });
                setUnreadCount(0);
                // Optimistically update local state if needed
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            } catch (error) {
                console.error("Failed to mark notifications as read", error);
            }
        }
    };

    const toggleNotifications = () => {
        if (!showNotifications) {
            markAsRead();
        }
        setShowNotifications(!showNotifications);
    };

    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 30,
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                borderBottom: "1px solid var(--border-color)",
                background: "var(--bg-primary)",
                backdropFilter: "blur(12px)",
            }}
        >
            <button
                onClick={onMenuClick}
                className="lg:hidden"
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-primary)",
                    padding: 8,
                    borderRadius: 8,
                }}
            >
                <Menu size={22} />
            </button>

            {/* Mobile Logo */}
            <div className="lg:hidden" style={{ height: 32 }}>
                <Link href="/">
                    <Logo className="h-full" />
                </Link>
            </div>

            <div className="hidden lg:block" />

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="relative">
                    <button
                        onClick={toggleNotifications}
                        className="relative p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-all ease-in-out duration-200"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[var(--bg-primary)]" />
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-in-up">
                            <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
                                <h3 className="font-bold text-[var(--text-primary)]">Notifications</h3>
                                <button
                                    onClick={() => {
                                        markAsRead();
                                        setUnreadCount(0);
                                        setShowNotifications(false);
                                    }}
                                    className="text-xs text-indigo-500 hover:text-indigo-600 font-medium"
                                >
                                    Mark all read
                                </button>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-[var(--text-secondary)] text-sm">
                                        No notifications yet
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification._id}
                                            className={`p-4 border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors ${!notification.read ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.read ? "bg-indigo-500" : "bg-transparent"}`} />
                                                <div>
                                                    <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{notification.title}</h4>
                                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{notification.message}</p>
                                                    <span className="text-[10px] text-[var(--text-muted)] mt-2 block">
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={toggleTheme}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-secondary)",
                        padding: 8,
                        borderRadius: 10,
                        transition: "all 0.2s ease",
                    }}
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Currency Toggle */}
                <button
                    onClick={() => toggleCurrency()}
                    className="flex items-center justify-center w-9 h-9 rounded-xl font-bold text-sm hover:bg-[var(--bg-secondary)] transition-colors border border-[var(--border-color)] ml-2"
                >
                    {currency === "INR" ? "₹" : "$"}
                </button>

                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "var(--gradient-card)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "white",
                        marginLeft: 4,
                    }}
                >
                    DK
                </div>
            </div>
        </header >
    );
}
