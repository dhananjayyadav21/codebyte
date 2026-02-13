const rateMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, maxAttempts = 5, windowMs = 60_000): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const entry = rateMap.get(key);

    if (!entry || now > entry.resetAt) {
        rateMap.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: maxAttempts - 1 };
    }

    entry.count++;
    const remaining = Math.max(0, maxAttempts - entry.count);
    return { allowed: entry.count <= maxAttempts, remaining };
}
