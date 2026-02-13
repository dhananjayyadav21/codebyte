"use client";

import { useState, useEffect } from "react";
import { Sparkles, Brain, CheckCircle2, HelpCircle, AlertCircle, Lightbulb, Loader2 } from "lucide-react";
import { Lesson } from "@/lib/mock-data";

// Mock AI Data for demo purposes
const aiData: Record<string, { takeaways: string[], quiz: { question: string, options: string[], answer: number } }> = {
    "l1": {
        takeaways: [
            "Fractional investing lowers the barrier to entry, allowing you to own expensive stocks with small capital.",
            "It enables precise dollar-amount investing rather than share-count investing.",
            "You maintain full eligibility for proportional dividends and market gains."
        ],
        quiz: {
            question: "If a stock costs $1000 and you invest $10, how much of the share do you own?",
            options: ["0.1 shares", "0.01 shares", "0.001 shares", "None, you need $1000"],
            answer: 1
        }
    },
    // Fallback for others
    "default": {
        takeaways: [
            "This lesson covers fundamental investment concepts essential for building wealth.",
            "Understanding these risks and rewards is crucial for long-term portfolio health.",
            "Consistent application of these principles leads to better financial decision making."
        ],
        quiz: {
            question: "What is the primary benefit of understanding this concept?",
            options: ["Guaranteed profits", "Reduced risk", "Informed decision making", "Faster trading"],
            answer: 2
        }
    }
};

export default function AILessonAssistant({ lesson }: { lesson: Lesson }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(aiData["default"]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        // Simulate AI processing time
        setLoading(true);
        const timer = setTimeout(() => {
            setData(aiData[lesson.id] || aiData["default"]);
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [lesson.id]);

    const handleQuizSubmit = (index: number) => {
        setSelectedOption(index);
        setShowResult(true);
    };

    if (loading) {
        return (
            <div className="card p-6 border-indigo-100 dark:border-indigo-900/30 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10">
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
                        <Brain className="w-10 h-10 text-indigo-500 animate-bounce" />
                    </div>
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>AI is analyzing lesson content...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card p-0 overflow-hidden border-indigo-200 dark:border-indigo-800 shadow-lg shadow-indigo-500/5 animate-fade-in-up">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <h3 className="font-bold text-lg">AI Smart Summary</h3>
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium backdrop-blur-sm">
                    Beta
                </span>
            </div>

            <div className="p-6 space-y-6 bg-white dark:bg-[var(--bg-card)]">
                {/* Key Takeaways */}
                <div>
                    <h4 className="flex items-center gap-2 font-bold text-[var(--text-primary)] mb-3">
                        <Lightbulb className="w-5 h-5 text-amber-500" /> Key Takeaways
                    </h4>
                    <ul className="space-y-3">
                        {data.takeaways.map((point, i) => (
                            <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border-color)]">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                                    {i + 1}
                                </span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="h-px bg-[var(--border-color)]" />

                {/* Quick Quiz */}
                <div>
                    <h4 className="flex items-center gap-2 font-bold text-[var(--text-primary)] mb-4">
                        <HelpCircle className="w-5 h-5 text-emerald-500" /> Quick Knowledge Check
                    </h4>

                    <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                        <p className="font-medium text-[var(--text-primary)] mb-4">
                            {data.quiz.question}
                        </p>

                        <div className="space-y-2">
                            {data.quiz.options.map((option, i) => {
                                const isSelected = selectedOption === i;
                                const isCorrect = i === data.quiz.answer;
                                const showCorrect = showResult && isCorrect;
                                const showError = showResult && isSelected && !isCorrect;

                                return (
                                    <button
                                        key={i}
                                        disabled={showResult}
                                        onClick={() => handleQuizSubmit(i)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${showCorrect
                                                ? "bg-emerald-100 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold"
                                                : showError
                                                    ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400"
                                                    : "bg-[var(--bg-card)] border-[var(--border-color)] hover:border-indigo-400 hover:shadow-sm"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {showCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                            {showError && <AlertCircle className="w-4 h-4 text-red-500" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {showResult && (
                            <div className={`mt-4 p-3 rounded-lg text-sm text-center font-medium animate-fade-in ${selectedOption === data.quiz.answer
                                    ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                                    : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                                }`}>
                                {selectedOption === data.quiz.answer
                                    ? "🎉 Correct! You nailed it."
                                    : "Incorrect. Give it another try!"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
