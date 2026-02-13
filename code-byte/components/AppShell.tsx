"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ minHeight: "100vh" }}>
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="main-content">
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
                <main style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
