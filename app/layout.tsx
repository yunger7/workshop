import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { jetBrainsMono } from "@/app/fonts";
import { ThemeProvider } from "@/contexts/theme";
import { TopLoader } from "@/components/top-loader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { StatusBar } from "@/components/status-bar";
import { Explorer } from "@/components/explorer";
import { GlobalKeyboardShortcutsProvider } from "@/contexts/global-keyboard-shortcuts";
import { ViewsProvider } from "@/contexts/views";
import { Path, PathType } from "@/types/path";
import { listPosts } from "@/lib/data/writing";
import { getProjects } from "@/lib/data/projects";
import { getTools } from "@/lib/data/tools";
import "./globals.css";

export const metadata: Metadata = {
    title: "yunger.dev",
};

const getSearchPaths = unstable_cache(
    async () => {
        const paths: Path[] = [
            ...listPosts({ sorted: true }).map((post) => ({
                type: "writing" as PathType,
                alt: post.slug,
                href: `/writing/${post.slug}`,
            })),
            ...getProjects().map((project) => {
                const primaryLink =
                    project.links.find((link) => link.isPrimary) ??
                    project.links[0];

                return {
                    type: "project" as PathType,
                    alt: project.title,
                    href: primaryLink.url,
                };
            }),
            ...getTools()
                .filter((tool) => !tool.unreleased)
                .map((tool) => ({
                    type: "tool" as PathType,
                    alt: tool.slug,
                    href: `/tools/${tool.slug}`,
                })),
        ];

        return paths;
    },
    ["search"],
    { tags: ["search"], revalidate: false },
);

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const searchPaths = await getSearchPaths();

    return (
        <html lang="en" className="min-h-screen">
            <body
                className={`${jetBrainsMono.variable} font-mono text-sm antialiased`}
            >
                <ThemeProvider
                    disableTransitionOnChange
                    enableSystem={false}
                    attribute="class"
                    defaultTheme="dark"
                >
                    <TopLoader />
                    <ViewsProvider paths={searchPaths}>
                        <GlobalKeyboardShortcutsProvider>
                            <TooltipProvider>
                                <Explorer paths={searchPaths}>
                                    {children}
                                </Explorer>
                                <StatusBar />
                            </TooltipProvider>
                        </GlobalKeyboardShortcutsProvider>
                    </ViewsProvider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
