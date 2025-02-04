import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { jetBrainsMono } from "@/app/fonts";
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
                className={cn(
                    jetBrainsMono.variable,
                    "min-h-screen p-4 font-mono text-sm",
                )}
            >
                {children}
            </body>
        </html>
    );
}
