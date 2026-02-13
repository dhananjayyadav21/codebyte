"use client";

import { Logo } from "@/components/Logo";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Sparkles,
  Shield,
  TrendingUp,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useState } from "react";

const features = [
  {
    icon: BarChart3,
    title: "Fractional Investing",
    description: "Own pieces of any stock starting from just $1. No need to buy a full share.",
    color: "#6366f1",
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    description: "Smart recommendations tailored to your risk profile and goals.",
    color: "#8b5cf6",
  },
  {
    icon: Shield,
    title: "Beginner Mode",
    description: "Simple explanations and guided investing for newcomers.",
    color: "#06b6d4",
  },
  {
    icon: TrendingUp,
    title: "Growth Potential",
    description: "Track performance and simulate future returns with our tools.",
    color: "#10b981",
  },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(16px, 4vw, 48px)",
          background: "var(--bg-primary)",
          borderBottom: "1px solid var(--border-color)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Logo className="h-8" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: 24 }}>
          <Link href="/dashboard" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
            Dashboard
          </Link>
          <Link href="/stocks" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
            Stocks
          </Link>
          <Link href="/learn" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
            Learn
          </Link>
          <button onClick={toggleTheme} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: 8, borderRadius: 10 }}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            href="/login"
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              background: "var(--gradient-card)",
              color: "white",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-primary)", padding: 8 }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden" style={{ position: "fixed", top: 72, left: 0, right: 0, bottom: 0, zIndex: 40, background: "var(--bg-primary)", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ color: "var(--text-primary)", textDecoration: "none", fontSize: 18, fontWeight: 500, padding: "12px 0", borderBottom: "1px solid var(--border-color)" }}>Dashboard</Link>
          <Link href="/stocks" onClick={() => setMenuOpen(false)} style={{ color: "var(--text-primary)", textDecoration: "none", fontSize: 18, fontWeight: 500, padding: "12px 0", borderBottom: "1px solid var(--border-color)" }}>Stocks</Link>
          <Link href="/learn" onClick={() => setMenuOpen(false)} style={{ color: "var(--text-primary)", textDecoration: "none", fontSize: 18, fontWeight: 500, padding: "12px 0", borderBottom: "1px solid var(--border-color)" }}>Learn</Link>
          <Link href="/login" onClick={() => setMenuOpen(false)} style={{ padding: "14px 24px", borderRadius: 12, background: "var(--gradient-card)", color: "white", textDecoration: "none", fontSize: 16, fontWeight: 600, textAlign: "center", marginTop: 8 }}>Get Started</Link>
        </div>
      )}

      {/* Hero */}
      <section
        style={{
          paddingTop: 160,
          paddingBottom: 100,
          textAlign: "center",
          background: "var(--gradient-hero)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div
            className="animate-fade-in-up"
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.15)",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 24,
              backdropFilter: "blur(8px)",
            }}
          >
            🚀 Powered by AI • Start For Free
          </div>
          <h1
            className="animate-fade-in-up"
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              marginBottom: 20,
              animationDelay: "0.1s",
            }}
          >
            Invest Smart.
            <br />
            Start Small.
          </h1>
          <p
            className="animate-fade-in-up"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.6,
              marginBottom: 40,
              animationDelay: "0.2s",
            }}
          >
            Buy fractional shares of any stock starting from $1.
            <br className="hidden sm:block" />
            AI-powered insights to help you grow your wealth.
          </p>
          <div className="animate-fade-in-up" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animationDelay: "0.3s" }}>
            <Link
              href="/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: 14,
                background: "white",
                color: "#4f46e5",
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 700,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              }}
            >
              Start Investing <ArrowRight size={18} />
            </Link>
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.15)",
                color: "white",
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 600,
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px clamp(16px, 4vw, 48px)", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>
            Why StakeWise?
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
            Everything you need to start your investment journey, all in one beautifully simple platform.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <div
              key={i}
              className="card animate-fade-in-up"
              style={{ padding: 28, animationDelay: `${i * 0.1}s`, cursor: "default" }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: f.color + "18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <f.icon size={24} color={f.color} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "60px clamp(16px, 4vw, 48px)",
          maxWidth: 800,
          margin: "0 auto 80px",
          textAlign: "center",
        }}
      >
        <div
          className="card"
          style={{
            padding: "48px 32px",
            background: "var(--gradient-card)",
            border: "none",
          }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 12 }}>
            Ready to grow your wealth?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, marginBottom: 28 }}>
            Join thousands of smart investors. No minimum balance required.
          </p>
          <Link
            href="/signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              borderRadius: 14,
              background: "white",
              color: "#4f46e5",
              textDecoration: "none",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border-color)", padding: "32px clamp(16px, 4vw, 48px)", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
          © 2026 StakeWise. Built for hackathons with ❤️
        </p>
      </footer>
    </div>
  );
}
