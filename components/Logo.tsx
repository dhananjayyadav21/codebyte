"use client";

import { useTheme } from "./ThemeProvider";

export function Logo({ className, showTagline = false }: { className?: string; showTagline?: boolean }) {
    const { theme } = useTheme();

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 60"
            className={className}
            className={className}
        >
            <defs>
                <linearGradient id="logo_grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: "#6366f1", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
                </linearGradient>
            </defs>

            {/* Icon: Stack of Coins */}
            <g transform="translate(10, 15)">
                <ellipse cx="15" cy="25" rx="12" ry="6" fill="#6366f1" />
                <ellipse cx="15" cy="20" rx="12" ry="6" fill="#8b5cf6" />
                <ellipse cx="15" cy="15" rx="12" ry="6" fill="#a78bfa" />
                {/* Arrow */}
                <path
                    d="M25 25 L35 15 M35 15 L28 15 M35 15 L35 22"
                    stroke="#10b981"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>

            {/* Text: StakeWise */}
            <text
                x="55"
                y="38"
                fontFamily="sans-serif"
                fontSize="24"
                fontWeight="bold"
                fill="var(--text-primary)"
            >
                Stake
            </text>
            <text
                x="122"
                y="38"
                fontFamily="sans-serif"
                fontSize="24"
                fontWeight="bold"
                fill="url(#logo_grad)"
            >
                Wise
            </text>

            {/* Tagline */}
            {showTagline && (
                <text
                    x="55"
                    y="52"
                    fontFamily="sans-serif"
                    fontSize="8"
                    fill="#9ca3af" // text-gray-400
                >
                    Own Smarter. Grow Together.
                </text>
            )}
        </svg>
    );
}
