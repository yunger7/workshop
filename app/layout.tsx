import type { Metadata } from "next";
import { jetBrainsMono } from "@/app/fonts";
import { ThemeProvider } from "@/contexts/theme";
import { TopLoader } from "@/components/top-loader";
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
                className={`${jetBrainsMono.variable} min-h-screen p-4 font-mono text-sm`}
            >
                <ThemeProvider
                    disableTransitionOnChange
                    enableSystem={false}
                    attribute="class"
                    defaultTheme="dark"
                >
                    <TopLoader />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
