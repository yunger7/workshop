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
            <body className="bg-zinc-800 text-zinc-200 p-4 min-h-screen ">{children}</body>
        </html>
    );
}
