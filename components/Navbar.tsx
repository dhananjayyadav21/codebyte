"use client";

import { Menu, Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface NavbarProps {
    onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    const { theme, toggleTheme } = useTheme();

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

            <div className="hidden lg:block" />

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                    style={{
                        position: "relative",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-secondary)",
                        padding: 8,
                        borderRadius: 10,
                        transition: "all 0.2s ease",
                    }}
                >
                    <Bell size={20} />
                    <span
                        style={{
                            position: "absolute",
                            top: 6,
                            right: 6,
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "var(--red)",
                        }}
                    />
                </button>

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
        </header>
    );
}
