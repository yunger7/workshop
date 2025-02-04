import type { Metadata } from "next";
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
                className={`${jetBrainsMono.variable} min-h-screen bg-zinc-800 p-4 font-mono text-sm text-zinc-200`}
            >
                {children}
            </body>
        </html>
    );
}
