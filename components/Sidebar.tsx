"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    TrendingUp,
    BookOpen,
    LogIn,
    X,
    Sparkles,
} from "lucide-react";
import { Logo } from "./Logo";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/stocks", label: "Stocks", icon: TrendingUp },
    { href: "/learn", label: "Learn", icon: BookOpen },
];

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Overlay for mobile */}
            {open && (
                <div
                    className="fixed inset-0 z-40 lg:hidden bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0`}
            >
                {/* Logo */}
                <div
                    style={{
                        padding: "24px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid var(--border-color)",
                    }}
                >
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                        <div style={{ height: 32 }}>
                            <Logo />
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden"
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--text-secondary)",
                            padding: 4,
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Nav Links */}
                <nav style={{ padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "12px 16px",
                                    borderRadius: 12,
                                    textDecoration: "none",
                                    fontSize: 14,
                                    fontWeight: isActive ? 600 : 500,
                                    color: isActive ? "var(--accent)" : "var(--text-secondary)",
                                    background: isActive ? "var(--accent)" + "15" : "transparent",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div style={{ padding: "16px 12px", borderTop: "1px solid var(--border-color)" }}>
                    <Link
                        href="/login"
                        onClick={onClose}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "12px 16px",
                            borderRadius: 12,
                            textDecoration: "none",
                            fontSize: 14,
                            fontWeight: 500,
                            color: "var(--text-secondary)",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <LogIn size={20} />
                        Login
                    </Link>
                </div>
            </aside>
        </>
    );
}
