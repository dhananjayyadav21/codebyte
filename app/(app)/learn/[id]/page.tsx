"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { lessons } from "@/lib/mock-data";
import { ArrowLeft, Clock, BarChart2, BookOpen, Share2 } from "lucide-react";
import { marked } from "marked";

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [showToast, setShowToast] = useState(false);
    const lesson = lessons.find((l) => l.id === id);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: lesson.title,
                    text: `Check out this lesson on ${lesson.title}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Lesson Not Found</h2>
                <Link href="/learn" className="text-[var(--accent)] hover:underline">
                    Back to Lessons
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in relative">
            {/* Toast for Copy Feedback */}
            {showToast && (
                <div className="fixed top-24 right-4 z-50 px-4 py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-semibold shadow-lg animate-fade-in-up">
                    Link copied to clipboard!
                </div>
            )}

            {/* Back Button */}
            <Link href="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors">
                <ArrowLeft size={16} /> Back to Lessons
            </Link>

            {/* Header */}
            <div className="card p-6 md:p-10 mb-8 border-b-4 border-[var(--accent)]">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center text-4xl flex-shrink-0 shadow-sm">
                            {lesson.icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${lesson.difficulty === "Beginner"
                                    ? "bg-[var(--green-bg)] text-[var(--green)]"
                                    : lesson.difficulty === "Intermediate"
                                        ? "bg-[var(--yellow-bg)] text-[var(--yellow)]"
                                        : "bg-[var(--red-bg)] text-[var(--red)]"
                                    }`}>
                                    {lesson.difficulty}
                                </span>
                                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                                    {lesson.category}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-extrabold text-[var(--text-primary)] leading-tight mb-2">
                                {lesson.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <Clock size={16} /> {lesson.duration} read
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <BarChart2 size={16} /> Level: {lesson.difficulty}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Share Button */}
                    <button
                        onClick={handleShare}
                        className="p-3 rounded-full bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors"
                        title="Share Lesson"
                    >
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="card p-8 md:p-12">
                <article className="prose prose-lg dark:prose-invert max-w-none">
                    <div
                        dangerouslySetInnerHTML={{ __html: marked(lesson.content || "") }}
                    />
                </article>

                <div className="mt-12 pt-8 border-t border-[var(--border-color)] flex justify-between items-center">
                    <p className="text-sm text-[var(--text-muted)] italic">
                        Congratulations! You've completed this lesson.
                    </p>
                    <Link
                        href="/learn"
                        className="px-6 py-3 rounded-xl bg-[var(--gradient-card)] text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
                    >
                        <BookOpen size={18} /> Complete & Return
                    </Link>
                </div>
            </div>
        </div>
    );
}
