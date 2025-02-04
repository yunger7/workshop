import type { Metadata } from "next";
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
            <body className="min-h-screen bg-zinc-800 p-4 text-zinc-200">
                {children}
            </body>
        </html>
    );
}
