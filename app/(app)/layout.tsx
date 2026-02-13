import AppShell from "@/components/AppShell";
import { CurrencyProvider } from "@/components/CurrencyProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <CurrencyProvider>
            <AppShell>{children}</AppShell>
        </CurrencyProvider>
    );
}
