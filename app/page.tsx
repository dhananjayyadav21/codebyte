"use client";

import { Logo } from "@/components/Logo";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  PieChart,
  Users,
  CheckCircle2,
  Menu,
  X,
  ChevronRight,
  Star,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useState, useEffect } from "react";

// Stats Data
const stats = [
  { label: "Active Investors", value: "50K+", icon: Users },
  { label: "Assets Mananged", value: "$120M+", icon: PieChart },
  { label: "Countries", value: "30+", icon: Globe },
];

// Features Data
const features = [
  {
    icon: TrendingUp,
    title: "Fractional Investing",
    description: "Buy a slice of your favorite companies like Apple, Tesla, or Amazon with as little as $1.",
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    icon: Zap,
    title: "Instant Execution",
    description: "Real-time market execution ensures you never miss a price movement. Fast, reliable, and secure.",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Your assets are protected with 256-bit encryption and industry-leading security protocols.",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
];

// How It Works Steps
const steps = [
  {
    step: "01",
    title: "Create Account",
    description: "Sign up in minutes with just your email. No paperwork required.",
  },
  {
    step: "02",
    title: "Link Bank",
    description: "Securely connect your funding source to start investing instantly.",
  },
  {
    step: "03",
    title: "Start Growing",
    description: "Build your portfolio with stocks, ETFs, and automated strategies.",
  },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ fullName: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // Check auth status
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => setUser(null));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-indigo-500/30">

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled
          ? "bg-[var(--bg-primary)]/80 backdrop-blur-md border-[var(--border-color)] shadow-sm"
          : "bg-transparent border-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Logo className="h-7 w-auto transition-transform group-hover:scale-105" />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/learn" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Learn
              </Link>
              <Link href="/stocks" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Market
              </Link>
              <Link href="/about" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Company
              </Link>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-bold border border-[var(--border-color)] hover:bg-[var(--border-color)] transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-bold hover:bg-[var(--accent)] hover:text-white transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-indigo-500/25"
                  >
                    Start Investing
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-[var(--bg-primary)] border-b border-[var(--border-color)] p-4 md:hidden flex flex-col gap-4 shadow-xl animate-fade-in-down">
            <Link href="/learn" className="text-base font-medium p-2 text-[var(--text-primary)]">Learn</Link>
            <Link href="/stocks" className="text-base font-medium p-2 text-[var(--text-primary)]">Market</Link>
            <hr className="border-[var(--border-color)]" />
            {user ? (
              <>
                <Link href="/dashboard" className="text-base font-medium p-2 text-[var(--text-primary)]">Dashboard</Link>
                <button onClick={handleLogout} className="w-full text-center py-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold border border-[var(--border-color)]">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-base font-medium p-2 text-[var(--text-primary)]">Log In</Link>
                <Link href="/signup" className="w-full text-center py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold">
                  Start Investing
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] mb-6 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-semibold text-[var(--text-secondary)] tracking-wide uppercase">New Features Added</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] mb-5 leading-[1.1] animate-fade-in-up delay-100">
            Invest in your future, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              without limits.
            </span>
          </h1>

          <p className="mt-5 text-lg text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Join the fastest growing platform for fractional investing. Build a diverse portfolio of US stocks and ETFs starting with just $1.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in-up delay-300">
            {user ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-base hover:bg-[var(--accent)] hover:text-white transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <Link
                href="/signup"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-base hover:bg-[var(--accent)] hover:text-white transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                Open Free Account <ArrowRight size={18} />
              </Link>
            )}

            <Link
              href="/stocks"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold text-base hover:bg-[var(--border-color)] transition-all border border-[var(--border-color)] flex items-center justify-center gap-2"
            >
              Explore Stocks
            </Link>
          </div>

          {/* Trusted By / Stats */}
          <div className="mt-16 pt-8 border-t border-[var(--border-color)] grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-up delay-500">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mb-1">{stat.value}</div>
                <div className="text-xs font-medium text-[var(--text-muted)] flex items-center justify-center gap-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-[var(--bg-secondary)]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3">Why choose StakeWise?</h2>
            <p className="text-[var(--text-secondary)] text-sm max-w-xl mx-auto">
              We break down barriers so you can build wealth. Experience the new standard in retail investing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.bg} ${feature.color}`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-indigo-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight">
                Investing made <br />
                <span className="text-indigo-500">simple and efficient.</span>
              </h2>
              <p className="text-base text-[var(--text-secondary)] mb-6">
                Our platform is designed for everyone. Whether you are a complete beginner or a seasoned pro, we have the tools you need.
              </p>

              <div className="flex flex-col gap-6">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="text-3xl font-black text-[var(--border-color)]">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1">{step.title}</h4>
                      <p className="text-[var(--text-secondary)] text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Abstract UI Mockup */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2">
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                  <span className="text-[var(--text-muted)] font-medium text-sm">Platform Interactive Demo</span>
                </div>
              </div>
              {/* Decorative Blob */}
              <div className="absolute -top-10 -right-10 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto rounded-[2rem] overflow-hidden relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center px-6 py-12 md:py-16 shadow-2xl">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to start your journey?</h2>
            <p className="text-indigo-100 text-base md:text-lg max-w-xl mx-auto mb-8">
              Join thousands of investors who are already building their wealth with StakeWise. No hidden fees. No minimums.
            </p>
            {!user && (
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-indigo-600 font-bold text-base hover:bg-gray-50 transition-transform hover:-translate-y-1 shadow-lg"
              >
                Get Started Now <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <Logo className="h-8 w-auto mb-6" />
              <p className="text-[var(--text-secondary)] text-sm mb-6">
                Making the stock market accessible to everyone, everywhere.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[var(--text-primary)] mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
                <li><Link href="/stocks" className="hover:text-[var(--accent)]">Stocks & ETFs</Link></li>
                <li><Link href="/pricing" className="hover:text-[var(--accent)]">Pricing</Link></li>
                <li><Link href="/learn" className="hover:text-[var(--accent)]">Education</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[var(--text-primary)] mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
                <li><Link href="/about" className="hover:text-[var(--accent)]">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-[var(--accent)]">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-[var(--accent)]">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[var(--text-primary)] mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
                <li><Link href="/privacy" className="hover:text-[var(--accent)]">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[var(--accent)]">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="hover:text-[var(--accent)]">Risk Disclosure</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[var(--text-muted)]">
              © 2026 StakeWise Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              {/* Social Icons Placeholder */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
