import type { Metadata } from "next";
import { jetBrainsMono } from "@/app/fonts";
import { ThemeProvider } from "@/contexts/theme";
import { TopLoader } from "@/components/top-loader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { GlobalKeyboardShortcutsProvider } from "@/contexts/global-keyboard-shortcuts";
import { SearchProvider } from "@/contexts/search";
import "./globals.css";

export const metadata: Metadata = {
    title: "yunger.dev",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${jetBrainsMono.variable} min-h-screen font-mono text-sm antialiased`}
            >
                <ThemeProvider
                    disableTransitionOnChange
                    enableSystem={false}
                    attribute="class"
                    defaultTheme="dark"
                >
                    <TopLoader />
                    <SearchProvider>
                        <GlobalKeyboardShortcutsProvider>
                            <TooltipProvider>{children}</TooltipProvider>
                        </GlobalKeyboardShortcutsProvider>
                    </SearchProvider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
