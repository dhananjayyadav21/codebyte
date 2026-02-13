export interface Stock {
    id: string;
    symbol: string;
    name: string;
    logo: string;
    price: number;
    change: number;
    changePercent: number;
    marketCap: number;
    volume: number;
    high52w: number;
    low52w: number;
    pe: number;
    eps: number;
    dividend: number;
    sector: string;
    risk: "Low" | "Medium" | "High";
    growthScore: number;
    aiRecommendation: "Strong Buy" | "Buy" | "Hold" | "Risky";
    description: string;
    history: { date: string; price: number }[];
}

export interface PortfolioHolding {
    stockId: string;
    symbol: string;
    name: string;
    shares: number;
    avgPrice: number;
    currentPrice: number;
}

export interface Activity {
    id: string;
    type: "buy" | "sell" | "dividend";
    symbol: string;
    name: string;
    shares: number;
    price: number;
    date: string;
}

export interface Lesson {
    id: string;
    title: string;
    description: string;
    category: string;
    duration: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    icon: string;
}

function generateHistory(basePrice: number, days: number = 90): { date: string; price: number }[] {
    const history: { date: string; price: number }[] = [];
    let price = basePrice * 0.85;
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        price = price + (Math.random() - 0.45) * (basePrice * 0.02);
        price = Math.max(price, basePrice * 0.6);
        history.push({
            date: date.toISOString().split("T")[0],
            price: Math.round(price * 100) / 100,
        });
    }
    return history;
}

export const stocks: Stock[] = [
    {
        id: "1", symbol: "AAPL", name: "Apple Inc.", logo: "🍎",
        price: 189.84, change: 2.45, changePercent: 1.31, marketCap: 2.95e12, volume: 54.2e6,
        high52w: 199.62, low52w: 143.90, pe: 31.2, eps: 6.08, dividend: 0.52,
        sector: "Technology", risk: "Low", growthScore: 85, aiRecommendation: "Strong Buy",
        description: "Apple designs, manufactures and markets smartphones, personal computers, tablets, wearables and accessories.",
        history: generateHistory(189.84),
    },
    {
        id: "2", symbol: "MSFT", name: "Microsoft Corp.", logo: "🪟",
        price: 378.91, change: 4.12, changePercent: 1.10, marketCap: 2.81e12, volume: 22.1e6,
        high52w: 384.30, low52w: 275.37, pe: 35.8, eps: 10.58, dividend: 0.75,
        sector: "Technology", risk: "Low", growthScore: 88, aiRecommendation: "Strong Buy",
        description: "Microsoft develops and supports software, services, devices and solutions worldwide.",
        history: generateHistory(378.91),
    },
    {
        id: "3", symbol: "GOOGL", name: "Alphabet Inc.", logo: "🔍",
        price: 141.80, change: -0.95, changePercent: -0.67, marketCap: 1.77e12, volume: 25.8e6,
        high52w: 153.78, low52w: 102.21, pe: 25.4, eps: 5.58, dividend: 0,
        sector: "Technology", risk: "Low", growthScore: 82, aiRecommendation: "Buy",
        description: "Alphabet is the parent company of Google, specializing in internet-related services and products.",
        history: generateHistory(141.80),
    },
    {
        id: "4", symbol: "AMZN", name: "Amazon.com Inc.", logo: "📦",
        price: 178.25, change: 3.67, changePercent: 2.10, marketCap: 1.85e12, volume: 48.9e6,
        high52w: 185.10, low52w: 118.35, pe: 62.1, eps: 2.87, dividend: 0,
        sector: "Consumer Cyclical", risk: "Medium", growthScore: 90, aiRecommendation: "Strong Buy",
        description: "Amazon is a multinational technology company focusing on e-commerce, cloud computing, and AI.",
        history: generateHistory(178.25),
    },
    {
        id: "5", symbol: "TSLA", name: "Tesla Inc.", logo: "⚡",
        price: 248.42, change: -5.30, changePercent: -2.09, marketCap: 789e9, volume: 112e6,
        high52w: 299.29, low52w: 152.37, pe: 78.4, eps: 3.17, dividend: 0,
        sector: "Automotive", risk: "High", growthScore: 75, aiRecommendation: "Risky",
        description: "Tesla designs, develops, manufactures and sells fully electric vehicles and energy solutions.",
        history: generateHistory(248.42),
    },
    {
        id: "6", symbol: "NVDA", name: "NVIDIA Corp.", logo: "🎮",
        price: 495.22, change: 12.80, changePercent: 2.65, marketCap: 1.22e12, volume: 42.5e6,
        high52w: 505.48, low52w: 222.97, pe: 65.3, eps: 7.58, dividend: 0.16,
        sector: "Technology", risk: "Medium", growthScore: 95, aiRecommendation: "Strong Buy",
        description: "NVIDIA designs GPUs for gaming, professional visualization, data centers and automotive markets.",
        history: generateHistory(495.22),
    },
    {
        id: "7", symbol: "JPM", name: "JPMorgan Chase", logo: "🏦",
        price: 172.30, change: 1.85, changePercent: 1.09, marketCap: 497e9, volume: 9.2e6,
        high52w: 175.20, low52w: 128.30, pe: 11.2, eps: 15.38, dividend: 4.2,
        sector: "Financial Services", risk: "Low", growthScore: 70, aiRecommendation: "Buy",
        description: "JPMorgan Chase is one of the world's largest banks offering investment banking and financial services.",
        history: generateHistory(172.30),
    },
    {
        id: "8", symbol: "JNJ", name: "Johnson & Johnson", logo: "💊",
        price: 156.74, change: 0.42, changePercent: 0.27, marketCap: 378e9, volume: 6.8e6,
        high52w: 175.97, low52w: 143.13, pe: 10.8, eps: 14.51, dividend: 3.80,
        sector: "Healthcare", risk: "Low", growthScore: 60, aiRecommendation: "Hold",
        description: "Johnson & Johnson researches, develops, manufactures and sells healthcare products worldwide.",
        history: generateHistory(156.74),
    },
    {
        id: "9", symbol: "V", name: "Visa Inc.", logo: "💳",
        price: 275.50, change: 2.10, changePercent: 0.77, marketCap: 564e9, volume: 7.1e6,
        high52w: 290.96, low52w: 227.10, pe: 30.5, eps: 9.03, dividend: 1.80,
        sector: "Financial Services", risk: "Low", growthScore: 78, aiRecommendation: "Buy",
        description: "Visa operates a global payments technology platform connecting consumers and merchants worldwide.",
        history: generateHistory(275.50),
    },
    {
        id: "10", symbol: "META", name: "Meta Platforms", logo: "👤",
        price: 353.96, change: 7.22, changePercent: 2.08, marketCap: 908e9, volume: 18.3e6,
        high52w: 358.20, low52w: 198.05, pe: 28.9, eps: 12.25, dividend: 0,
        sector: "Technology", risk: "Medium", growthScore: 86, aiRecommendation: "Buy",
        description: "Meta builds technologies that help people connect through augmented and virtual reality platforms.",
        history: generateHistory(353.96),
    },
    {
        id: "11", symbol: "DIS", name: "Walt Disney Co.", logo: "🏰",
        price: 95.20, change: -1.15, changePercent: -1.19, marketCap: 174e9, volume: 11.2e6,
        high52w: 123.74, low52w: 78.73, pe: 68.2, eps: 1.40, dividend: 0,
        sector: "Entertainment", risk: "Medium", growthScore: 55, aiRecommendation: "Hold",
        description: "Walt Disney operates as an entertainment company with theme parks, media networks, and streaming.",
        history: generateHistory(95.20),
    },
    {
        id: "12", symbol: "NFLX", name: "Netflix Inc.", logo: "🎬",
        price: 485.60, change: 8.90, changePercent: 1.87, marketCap: 213e9, volume: 5.4e6,
        high52w: 493.20, low52w: 344.73, pe: 45.2, eps: 10.75, dividend: 0,
        sector: "Entertainment", risk: "Medium", growthScore: 80, aiRecommendation: "Buy",
        description: "Netflix provides subscription video streaming services with a vast library of original content.",
        history: generateHistory(485.60),
    },
];

export const portfolioHoldings: PortfolioHolding[] = [
    { stockId: "1", symbol: "AAPL", name: "Apple Inc.", shares: 5.5, avgPrice: 175.20, currentPrice: 189.84 },
    { stockId: "2", symbol: "MSFT", name: "Microsoft Corp.", shares: 2.3, avgPrice: 350.00, currentPrice: 378.91 },
    { stockId: "6", symbol: "NVDA", name: "NVIDIA Corp.", shares: 1.8, avgPrice: 420.50, currentPrice: 495.22 },
    { stockId: "4", symbol: "AMZN", name: "Amazon.com Inc.", shares: 3.2, avgPrice: 155.00, currentPrice: 178.25 },
    { stockId: "9", symbol: "V", name: "Visa Inc.", shares: 4.0, avgPrice: 260.30, currentPrice: 275.50 },
    { stockId: "7", symbol: "JPM", name: "JPMorgan Chase", shares: 6.5, avgPrice: 155.80, currentPrice: 172.30 },
];

export const recentActivity: Activity[] = [
    { id: "a1", type: "buy", symbol: "NVDA", name: "NVIDIA Corp.", shares: 0.5, price: 490.10, date: "2026-02-12" },
    { id: "a2", type: "buy", symbol: "AAPL", name: "Apple Inc.", shares: 1.0, price: 187.50, date: "2026-02-11" },
    { id: "a3", type: "sell", symbol: "TSLA", name: "Tesla Inc.", shares: 2.0, price: 252.80, date: "2026-02-10" },
    { id: "a4", type: "dividend", symbol: "JPM", name: "JPMorgan Chase", shares: 6.5, price: 1.05, date: "2026-02-09" },
    { id: "a5", type: "buy", symbol: "AMZN", name: "Amazon.com Inc.", shares: 0.8, price: 176.30, date: "2026-02-08" },
    { id: "a6", type: "buy", symbol: "MSFT", name: "Microsoft Corp.", shares: 0.3, price: 375.20, date: "2026-02-07" },
];

export const portfolioHistory = (() => {
    const data: { date: string; value: number }[] = [];
    let value = 4200;
    for (let i = 90; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        value = value + (Math.random() - 0.42) * 80;
        value = Math.max(value, 3500);
        data.push({
            date: date.toISOString().split("T")[0],
            value: Math.round(value * 100) / 100,
        });
    }
    return data;
})();

export const lessons: Lesson[] = [
    { id: "l1", title: "What is Fractional Investing?", description: "Learn how you can own a piece of any stock, even expensive ones, starting from just $1.", category: "Basics", duration: "5 min", difficulty: "Beginner", icon: "📊" },
    { id: "l2", title: "Understanding Stock Prices", description: "Discover what makes stock prices go up and down, and how market forces work.", category: "Basics", duration: "8 min", difficulty: "Beginner", icon: "📈" },
    { id: "l3", title: "Risk vs. Reward", description: "Every investment has risk. Learn how to balance potential gains with possible losses.", category: "Strategy", duration: "10 min", difficulty: "Beginner", icon: "⚖️" },
    { id: "l4", title: "Building a Diversified Portfolio", description: "Don't put all your eggs in one basket. Learn the art of diversification.", category: "Strategy", duration: "12 min", difficulty: "Intermediate", icon: "🧺" },
    { id: "l5", title: "Reading Financial Statements", description: "Understand the basics of balance sheets, income statements, and cash flow.", category: "Analysis", duration: "15 min", difficulty: "Intermediate", icon: "📋" },
    { id: "l6", title: "What is P/E Ratio?", description: "One of the most important metrics to evaluate if a stock is overpriced or a bargain.", category: "Analysis", duration: "7 min", difficulty: "Beginner", icon: "🔢" },
    { id: "l7", title: "Dollar-Cost Averaging", description: "A simple strategy to reduce the impact of volatility on your investments.", category: "Strategy", duration: "6 min", difficulty: "Beginner", icon: "💰" },
    { id: "l8", title: "Understanding Market Cycles", description: "Markets go through boom and bust cycles. Learn how to navigate them.", category: "Advanced", duration: "20 min", difficulty: "Advanced", icon: "🔄" },
    { id: "l9", title: "Introduction to ETFs", description: "Exchange-traded funds let you invest in a basket of stocks at once. Learn how.", category: "Basics", duration: "8 min", difficulty: "Beginner", icon: "📦" },
];
