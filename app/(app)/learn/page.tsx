"use client";

import { useState } from "react";
import Link from "next/link";
import { lessons } from "@/lib/mock-data";
import { BookOpen, Clock, ChevronDown, ChevronUp } from "lucide-react";

type DifficultyFilter = "All" | "Beginner" | "Intermediate" | "Advanced";

export default function LearnPage() {
    const [filter, setFilter] = useState<DifficultyFilter>("All");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filtered = filter === "All" ? lessons : lessons.filter((l) => l.difficulty === filter);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mb-1">
                    Learn Investing
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                    Beginner-friendly lessons to build your investing knowledge.
                </p>
            </div>

            {/* Difficulty Filter */}
            <div className="flex flex-wrap gap-2">
                {(["All", "Beginner", "Intermediate", "Advanced"] as DifficultyFilter[]).map((d) => (
                    <button
                        key={d}
                        onClick={() => setFilter(d)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${filter === d
                            ? "bg-[var(--accent)] text-white border-transparent shadow-md"
                            : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]"
                            }`}
                    >
                        {d}
                    </button>
                ))}
            </div>

            {/* Lesson Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((lesson, i) => (
                    <div
                        key={lesson.id}
                        className="card p-6 cursor-pointer animate-fade-in-up hover:shadow-lg transition-all"
                        style={{
                            animationDelay: `${i * 0.05}s`,
                        }}
                        onClick={() => setExpandedId(expandedId === lesson.id ? null : lesson.id)}
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-2xl flex-shrink-0">
                                {lesson.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-base font-bold text-[var(--text-primary)] mb-1 leading-snug">
                                        {lesson.title}
                                    </h3>
                                    <div className="text-[var(--text-muted)] mt-1">
                                        {expandedId === lesson.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-2 items-center">
                                    <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
                                        <Clock size={12} /> {lesson.duration}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${lesson.difficulty === "Beginner"
                                        ? "bg-[var(--green-bg)] text-[var(--green)]"
                                        : lesson.difficulty === "Intermediate"
                                            ? "bg-[var(--yellow-bg)] text-[var(--yellow)]"
                                            : "bg-[var(--red-bg)] text-[var(--red)]"
                                        }`}>
                                        {lesson.difficulty}
                                    </span>
                                    <span className="text-xs text-[var(--text-muted)]">• {lesson.category}</span>
                                </div>

                                {expandedId === lesson.id && (
                                    <div className="animate-fade-in mt-3 pt-3 border-t border-[var(--border-color)]">
                                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                                            {lesson.description}
                                        </p>
                                        <Link
                                            href={`/learn/${lesson.id}`}
                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 no-underline"
                                        >
                                            <BookOpen size={16} /> Start Lesson
                                        </Link>
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
