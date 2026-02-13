"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "INR" | "USD";

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatPrice: (amount: number) => string;
    exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>("INR");
    const exchangeRate = 84; // Fixed rate for simplicity

    // Persist preference
    useEffect(() => {
        const stored = localStorage.getItem("preferredCurrency");
        if (stored === "USD" || stored === "INR") {
            setCurrency(stored);
        }
    }, []);

    const updateCurrency = (c: Currency) => {
        setCurrency(c);
        localStorage.setItem("preferredCurrency", c);
    };

    const formatPrice = (amountInINR: number) => {
        if (currency === "USD") {
            const val = amountInINR / exchangeRate;
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(val);
        } else {
            return new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(amountInINR);
        }
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency, formatPrice, exchangeRate }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
}
