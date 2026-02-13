"use client";

import { useState, useEffect } from "react";
import { Sparkles, Brain, CheckCircle2, HelpCircle, AlertCircle, Lightbulb, Loader2, BookOpen, Target, TrendingUp } from "lucide-react";
import { Lesson } from "@/lib/mock-data";

// Enhanced AI Data with detailed theory and multiple quizzes
const aiData: Record<string, {
    theory: { overview: string; keyPoints: string[]; examples: string[] };
    takeaways: string[];
    quiz: { question: string; options: string[]; answer: number; explanation: string }[];
    faq: { question: string; answer: string }[];
}> = {
    "l1": {
        theory: {
            overview: "Fractional investing revolutionizes stock market accessibility by allowing investors to purchase portions of shares rather than whole units. This democratization of investing means you can own a piece of high-value stocks like Amazon or Google with as little as $1.",
            keyPoints: [
                "**Accessibility**: No longer need thousands of dollars to invest in premium stocks",
                "**Diversification**: Spread small amounts across multiple stocks to reduce risk",
                "**Precision**: Invest exact dollar amounts instead of being constrained by share prices",
                "**Equal Opportunity**: Retail investors get the same proportional benefits as institutional investors"
            ],
            examples: [
                "Example 1: If Tesla stock costs $800/share and you have $100, you can buy 0.125 shares (12.5% of one share)",
                "Example 2: With $500, you could buy fractional shares of 10 different companies at $50 each, creating instant diversification",
                "Example 3: If a stock pays $4 dividend per share and you own 0.25 shares, you receive $1 in dividends"
            ]
        },
        takeaways: [
            "Fractional investing lowers the barrier to entry, allowing you to own expensive stocks with small capital.",
            "It enables precise dollar-amount investing rather than share-count investing, perfect for dollar-cost averaging strategies.",
            "You maintain full eligibility for proportional dividends and market gains - no benefits are lost.",
            "Diversification becomes achievable even with limited funds by spreading investments across multiple stocks.",
            "Fractional shares are real ownership - you have the same rights as whole-share holders, just proportionally.",
            "This approach is ideal for beginners who want to start investing without large capital requirements.",
            "Many modern brokerages offer fractional shares with zero commissions, making it cost-effective."
        ],
        quiz: [
            {
                question: "If a stock costs $1000 and you invest $10, how much of the share do you own?",
                options: ["0.1 shares", "0.01 shares", "0.001 shares", "None, you need $1000"],
                answer: 1,
                explanation: "$10 ÷ $1000 = 0.01 shares. You own 1% of one full share, which gives you proportional rights to dividends and price appreciation."
            },
            {
                question: "What is the main advantage of fractional investing for beginners?",
                options: ["Higher returns", "Lower barrier to entry", "Guaranteed profits", "No risk involved"],
                answer: 1,
                explanation: "The primary advantage is the lower barrier to entry - you can start investing with small amounts instead of needing thousands of dollars to buy whole shares of expensive stocks."
            },
            {
                question: "If you own 0.5 shares of a stock that pays $8 dividend per share, how much do you receive?",
                options: ["$8", "$4", "$0.50", "$0"],
                answer: 1,
                explanation: "You receive $4 (0.5 × $8). Fractional shareholders receive proportional dividends based on their ownership percentage."
            },
            {
                question: "Which strategy benefits most from fractional investing?",
                options: ["Day trading", "Dollar-cost averaging", "Short selling", "Options trading"],
                answer: 1,
                explanation: "Dollar-cost averaging benefits most because you can invest exact dollar amounts regularly (e.g., $100/month) regardless of share price fluctuations."
            }
        ],
        faq: [
            {
                question: "Do I have voting rights with fractional shares?",
                answer: "It depends on the broker. Some brokers aggregate fractional shares to exercise voting rights, while others may not offer voting for fractional ownership. Check with your specific broker's policy."
            },
            {
                question: "Can I sell fractional shares anytime?",
                answer: "Yes! Fractional shares can typically be sold just like whole shares during market hours. The sale is executed at the current market price, and you receive the proportional value."
            },
            {
                question: "Are there any fees for fractional investing?",
                answer: "Most modern brokerages offer commission-free fractional share trading. However, always verify with your broker as some may charge fees or have minimum investment requirements."
            }
        ]
    },
    "l4": {
        theory: {
            overview: "Building a diversified portfolio is the foundation of successful long-term investing. Diversification spreads your investments across different assets, sectors, and geographies to reduce risk while maintaining growth potential. It's the investment equivalent of 'not putting all your eggs in one basket' - protecting you from catastrophic losses while positioning you for steady returns.",
            keyPoints: [
                "**Asset Class Diversification**: Spread across stocks, bonds, real estate, and cash - each asset class behaves differently in various market conditions",
                "**Sector Diversification**: Invest across technology, healthcare, finance, energy, and other sectors to avoid industry-specific risks",
                "**Geographic Diversification**: Include US, international developed, and emerging markets to reduce country-specific risks",
                "**Rebalancing Strategy**: Regularly adjust your portfolio back to target allocations to maintain your desired risk level"
            ],
            examples: [
                "Example 1: A moderate portfolio might be 50% US stocks, 20% international stocks, 20% bonds, 5% REITs, 5% cash - providing growth with stability",
                "Example 2: Using ETFs like VTI (Total US Market) + VXUS (Total International) + AGG (Bonds) gives instant diversification across 10,000+ holdings",
                "Example 3: If your 60/40 stock/bond portfolio becomes 65/35 after a year due to stock growth, rebalancing means selling 5% stocks and buying bonds to return to 60/40"
            ]
        },
        takeaways: [
            "Diversification reduces portfolio volatility without necessarily reducing returns - it's the closest thing to a 'free lunch' in investing.",
            "The three pillars of diversification are asset class (stocks/bonds/real estate), sector (tech/healthcare/energy), and geography (US/international/emerging).",
            "ETFs and index funds make diversification simple and affordable - a single fund like VT gives exposure to 9,000+ global stocks.",
            "Your age and risk tolerance should guide allocation: younger investors can be more aggressive (80% stocks), older investors more conservative (40% stocks).",
            "Rebalancing annually or when allocations drift 5%+ maintains your strategy and forces you to 'buy low, sell high' systematically.",
            "Avoid false diversification - owning 10 tech stocks isn't diversified; true diversification means low correlation between holdings.",
            "Start simple with 3-5 broad ETFs covering US stocks, international stocks, and bonds, then refine as you gain experience."
        ],
        quiz: [
            {
                question: "What is the primary purpose of portfolio diversification?",
                options: ["Maximize returns", "Reduce risk", "Eliminate all losses", "Beat the market"],
                answer: 1,
                explanation: "The primary purpose is to reduce risk by spreading investments across different assets that don't move in perfect correlation. While diversification doesn't eliminate risk or guarantee returns, it significantly reduces the impact of any single investment's poor performance."
            },
            {
                question: "A conservative 55-year-old investor should typically have what stock/bond allocation?",
                options: ["80% stocks / 20% bonds", "60% stocks / 40% bonds", "40% stocks / 60% bonds", "20% stocks / 80% bonds"],
                answer: 2,
                explanation: "A 40/60 stock/bond split is appropriate for conservative older investors. This provides some growth potential from stocks while prioritizing capital preservation through bonds as they approach retirement."
            },
            {
                question: "Which ETF provides the broadest global diversification in a single fund?",
                options: ["SPY (S&P 500)", "VTI (Total US Market)", "VT (Total World Stock)", "AGG (US Bonds)"],
                answer: 2,
                explanation: "VT (Vanguard Total World Stock) provides exposure to 9,000+ stocks across 50+ countries, offering the most comprehensive global diversification in a single fund."
            },
            {
                question: "Your portfolio was 60% stocks / 40% bonds. After a year, it's now 65% stocks / 35% bonds. What should you do?",
                options: ["Leave it alone", "Buy more stocks", "Sell 5% of stocks and buy bonds", "Sell all stocks"],
                answer: 2,
                explanation: "Rebalancing means selling 5% of stocks and buying bonds to return to your 60/40 target. This maintains your desired risk level and forces you to sell high (stocks that grew) and buy low (bonds that lagged)."
            },
            {
                question: "Which is an example of FALSE diversification?",
                options: ["Owning 10 different tech stocks", "Owning stocks, bonds, and real estate", "Owning US and international stocks", "Owning stocks across 7 sectors"],
                answer: 0,
                explanation: "Owning 10 tech stocks is false diversification because they're all in the same sector and likely move together. True diversification requires spreading across different asset classes, sectors, and geographies with low correlation."
            }
        ],
        faq: [
            {
                question: "How many stocks do I need for proper diversification?",
                answer: "Research shows that 20-30 individual stocks provide most diversification benefits. Beyond 30, additional stocks add minimal risk reduction. However, most investors are better served by broad index funds or ETFs that hold hundreds or thousands of stocks, providing instant diversification."
            },
            {
                question: "Should I rebalance during a market crash?",
                answer: "Yes! Rebalancing during a crash means buying stocks when they're down (using your bond allocation), which is exactly when you should be buying. This disciplined approach removes emotion and forces you to buy low. However, consider tax implications in taxable accounts."
            },
            {
                question: "Is it better to own individual stocks or ETFs for diversification?",
                answer: "For most investors, ETFs are superior for diversification. A single broad market ETF like VTI gives exposure to 3,500+ stocks instantly. Building equivalent diversification with individual stocks would require significant capital, research, and ongoing management. Individual stocks are best for experienced investors who want targeted exposure."
            },
            {
                question: "How does diversification perform in market crashes?",
                answer: "Diversification doesn't prevent losses in crashes - if the overall market falls, your portfolio will too. However, diversified portfolios typically fall less and recover faster. In 2008, the S&P 500 fell 37%, but balanced 60/40 portfolios fell only 22% and recovered sooner due to bond stability."
            }
        ]
    },
    // Default fallback with enhanced content
    "default": {
        theory: {
            overview: "This lesson covers fundamental investment concepts that are essential for building long-term wealth. Understanding these principles helps you make informed decisions and manage risk effectively in your investment journey.",
            keyPoints: [
                "**Foundation**: Core concepts form the basis of successful investing strategies",
                "**Risk Management**: Understanding risks helps protect your capital",
                "**Long-term Thinking**: Patience and consistency are key to wealth building",
                "**Continuous Learning**: Markets evolve, so should your knowledge"
            ],
            examples: [
                "Example 1: Diversifying across sectors reduces company-specific risk",
                "Example 2: Regular monthly investments smooth out market volatility",
                "Example 3: Understanding P/E ratios helps identify value opportunities"
            ]
        },
        takeaways: [
            "This lesson covers fundamental investment concepts essential for building wealth.",
            "Understanding these risks and rewards is crucial for long-term portfolio health.",
            "Consistent application of these principles leads to better financial decision making.",
            "Knowledge compounds over time - the more you learn, the better investor you become.",
            "Emotional discipline is as important as technical knowledge in investing.",
            "Start small, learn continuously, and scale up as your confidence grows."
        ],
        quiz: [
            {
                question: "What is the primary benefit of understanding this concept?",
                options: ["Guaranteed profits", "Reduced risk", "Informed decision making", "Faster trading"],
                answer: 2,
                explanation: "The primary benefit is informed decision making. While we can't guarantee profits or eliminate risk, understanding concepts helps you make better choices aligned with your goals."
            },
            {
                question: "How does consistent learning impact your investing success?",
                options: ["No impact", "Minimal impact", "Significant positive impact", "Negative impact"],
                answer: 2,
                explanation: "Continuous learning has a significant positive impact. Markets evolve, new opportunities emerge, and staying informed helps you adapt and capitalize on changes."
            }
        ],
        faq: [
            {
                question: "How long does it take to see results from these principles?",
                answer: "Investment results typically manifest over years, not days or months. Most successful investors think in 5-10 year timeframes for significant wealth building."
            },
            {
                question: "Do I need a lot of money to start?",
                answer: "No! You can start with as little as $10-$50 thanks to fractional investing. The key is to start early and invest consistently, even if the amounts are small initially."
            }
        ]
    }
};

export default function AILessonAssistant({ lesson }: { lesson: Lesson }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(aiData["default"]);
    const [selectedOptions, setSelectedOptions] = useState<(number | null)[]>([]);
    const [showResults, setShowResults] = useState<boolean[]>([]);
    const [activeSection, setActiveSection] = useState<"theory" | "takeaways" | "quiz" | "faq">("theory");

    useEffect(() => {
        // Simulate AI processing time
        setLoading(true);
        const timer = setTimeout(() => {
            const lessonData = aiData[lesson.id] || aiData["default"];
            setData(lessonData);
            setSelectedOptions(new Array(lessonData.quiz.length).fill(null));
            setShowResults(new Array(lessonData.quiz.length).fill(false));
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [lesson.id]);

    const handleQuizSubmit = (quizIndex: number, optionIndex: number) => {
        const newSelected = [...selectedOptions];
        newSelected[quizIndex] = optionIndex;
        setSelectedOptions(newSelected);

        const newResults = [...showResults];
        newResults[quizIndex] = true;
        setShowResults(newResults);
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

    const correctCount = selectedOptions.filter((opt, idx) => opt === data.quiz[idx]?.answer).length;
    const attemptedCount = showResults.filter(Boolean).length;

    return (
        <div className="card p-0 overflow-hidden border-indigo-200 dark:border-indigo-800 shadow-lg shadow-indigo-500/5 animate-fade-in-up">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <h3 className="font-bold text-lg">AI Learning Assistant</h3>
                </div>
                <div className="flex items-center gap-2">
                    {attemptedCount > 0 && (
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium backdrop-blur-sm">
                            Score: {correctCount}/{attemptedCount}
                        </span>
                    )}
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium backdrop-blur-sm">
                        Beta
                    </span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                {[
                    { id: "theory", label: "Theory", icon: BookOpen },
                    { id: "takeaways", label: "Key Points", icon: Lightbulb },
                    { id: "quiz", label: "Quiz", icon: HelpCircle },
                    { id: "faq", label: "FAQ", icon: Target }
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all ${activeSection === tab.id
                                ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-[var(--bg-card)]"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                }`}
                        >
                            <Icon size={16} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="p-6 space-y-6 bg-white dark:bg-[var(--bg-card)] max-h-[600px] overflow-y-auto">
                {/* Theory Section */}
                {activeSection === "theory" && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800">
                            <h4 className="font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                <Brain size={18} className="text-indigo-500" />
                                Overview
                            </h4>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{data.theory.overview}</p>
                        </div>

                        <div>
                            <h4 className="font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                <TrendingUp size={18} className="text-emerald-500" />
                                Core Concepts
                            </h4>
                            <ul className="space-y-2">
                                {data.theory.keyPoints.map((point, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border-color)]">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                                            {i + 1}
                                        </span>
                                        <span dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                <Lightbulb size={18} className="text-amber-500" />
                                Practical Examples
                            </h4>
                            <div className="space-y-3">
                                {data.theory.examples.map((example, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{example}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Takeaways Section */}
                {activeSection === "takeaways" && (
                    <div className="animate-fade-in">
                        <h4 className="flex items-center gap-2 font-bold text-[var(--text-primary)] mb-4">
                            <Lightbulb className="w-5 h-5 text-amber-500" /> Key Takeaways
                        </h4>
                        <ul className="space-y-3">
                            {data.takeaways.map((point, i) => (
                                <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-color)]">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                                        {i + 1}
                                    </span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Quiz Section */}
                {activeSection === "quiz" && (
                    <div className="space-y-6 animate-fade-in">
                        <h4 className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
                            <HelpCircle className="w-5 h-5 text-emerald-500" /> Knowledge Check ({data.quiz.length} Questions)
                        </h4>

                        {data.quiz.map((q, quizIndex) => (
                            <div key={quizIndex} className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                                <p className="font-medium text-[var(--text-primary)] mb-4">
                                    <span className="text-indigo-500 font-bold mr-2">Q{quizIndex + 1}.</span>
                                    {q.question}
                                </p>

                                <div className="space-y-2">
                                    {q.options.map((option, i) => {
                                        const isSelected = selectedOptions[quizIndex] === i;
                                        const isCorrect = i === q.answer;
                                        const showCorrect = showResults[quizIndex] && isCorrect;
                                        const showError = showResults[quizIndex] && isSelected && !isCorrect;

                                        return (
                                            <button
                                                key={i}
                                                disabled={showResults[quizIndex]}
                                                onClick={() => handleQuizSubmit(quizIndex, i)}
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

                                {showResults[quizIndex] && (
                                    <div className={`mt-4 p-3 rounded-lg text-sm animate-fade-in ${selectedOptions[quizIndex] === q.answer
                                        ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                                        : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                                        }`}>
                                        <p className="font-semibold mb-1">
                                            {selectedOptions[quizIndex] === q.answer ? "✅ Correct!" : "💡 Explanation:"}
                                        </p>
                                        <p>{q.explanation}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* FAQ Section */}
                {activeSection === "faq" && (
                    <div className="space-y-4 animate-fade-in">
                        <h4 className="flex items-center gap-2 font-bold text-[var(--text-primary)] mb-4">
                            <Target className="w-5 h-5 text-violet-500" /> Frequently Asked Questions
                        </h4>

                        {data.faq.map((item, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                                <h5 className="font-bold text-[var(--text-primary)] mb-2 flex items-start gap-2">
                                    <span className="text-indigo-500 flex-shrink-0">Q:</span>
                                    <span>{item.question}</span>
                                </h5>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed pl-6">
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">A:</span> {item.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
