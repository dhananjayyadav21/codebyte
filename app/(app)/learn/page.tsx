"use client";

import { useState } from "react";
import { lessons } from "@/lib/mock-data";
import { BookOpen, Clock, ChevronDown, ChevronUp } from "lucide-react";

type DifficultyFilter = "All" | "Beginner" | "Intermediate" | "Advanced";

export default function LearnPage() {
    const [filter, setFilter] = useState<DifficultyFilter>("All");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filtered = filter === "All" ? lessons : lessons.filter((l) => l.difficulty === filter);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
                    Learn Investing
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                    Beginner-friendly lessons to build your investing knowledge.
                </p>
            </div>

            {/* Difficulty Filter */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(["All", "Beginner", "Intermediate", "Advanced"] as DifficultyFilter[]).map((d) => (
                    <button
                        key={d}
                        onClick={() => setFilter(d)}
                        style={{
                            padding: "8px 18px",
                            borderRadius: 10,
                            border: "1px solid var(--border-color)",
                            background: filter === d ? "var(--accent)" : "var(--bg-card)",
                            color: filter === d ? "white" : "var(--text-secondary)",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                    >
                        {d}
                    </button>
                ))}
            </div>

            {/* Lesson Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                {filtered.map((lesson, i) => (
                    <div
                        key={lesson.id}
                        className="card animate-fade-in-up"
                        style={{
                            padding: 24,
                            cursor: "pointer",
                            animationDelay: `${i * 0.05}s`,
                        }}
                        onClick={() => setExpandedId(expandedId === lesson.id ? null : lesson.id)}
                    >
                        <div style={{ display: "flex", alignItems: "start", gap: 14 }}>
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 14,
                                    background: "var(--bg-secondary)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 24,
                                    flexShrink: 0,
                                }}
                            >
                                {lesson.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
                                        {lesson.title}
                                    </h3>
                                    {expandedId === lesson.id ? (
                                        <ChevronUp size={18} color="var(--text-muted)" />
                                    ) : (
                                        <ChevronDown size={18} color="var(--text-muted)" />
                                    )}
                                </div>
                                <div style={{ display: "flex", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 4,
                                            fontSize: 12,
                                            color: "var(--text-muted)",
                                        }}
                                    >
                                        <Clock size={12} /> {lesson.duration}
                                    </span>
                                    <span
                                        style={{
                                            padding: "2px 8px",
                                            borderRadius: 6,
                                            fontSize: 11,
                                            fontWeight: 600,
                                            background:
                                                lesson.difficulty === "Beginner"
                                                    ? "var(--green-bg)"
                                                    : lesson.difficulty === "Intermediate"
                                                        ? "var(--yellow-bg)"
                                                        : "var(--red-bg)",
                                            color:
                                                lesson.difficulty === "Beginner"
                                                    ? "var(--green)"
                                                    : lesson.difficulty === "Intermediate"
                                                        ? "var(--yellow)"
                                                        : "var(--red)",
                                        }}
                                    >
                                        {lesson.difficulty}
                                    </span>
                                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                        {lesson.category}
                                    </span>
                                </div>
                                {expandedId === lesson.id && (
                                    <div className="animate-fade-in">
                                        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
                                            {lesson.description}
                                        </p>
                                        <button
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 6,
                                                padding: "8px 16px",
                                                borderRadius: 10,
                                                background: "var(--gradient-card)",
                                                color: "white",
                                                border: "none",
                                                fontSize: 13,
                                                fontWeight: 600,
                                                cursor: "pointer",
                                            }}
                                        >
                                            <BookOpen size={14} /> Start Lesson
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
