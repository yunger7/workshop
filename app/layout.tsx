import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { jetBrainsMono } from "@/app/fonts";
import { ThemeProvider } from "@/contexts/theme";
import { GlobalKeyboardShortcutsProvider } from "@/contexts/global-keyboard-shortcuts";
import { ViewsProvider } from "@/contexts/views";
import { SettingsProvider } from "@/contexts/settings";
import { CommandBarProvider } from "@/contexts/command-bar";
import { Path, PathType } from "@/types/path";
import { listPosts } from "@/lib/data/writing";
import { getProjects } from "@/lib/data/projects";
import { getTools } from "@/lib/data/tools";
import { TopLoader } from "@/components/top-loader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { StatusBar } from "@/components/status-bar";
import { Explorer } from "@/components/explorer";
import { CommandBar } from "@/components/command-bar";
import { SearchDialog } from "@/components/search-dialog";
import { HelpDialog } from "@/components/help-dialog";
import { ShortcutsDialog } from "@/components/shortcuts-dialog";
import "./globals.css";

export const metadata: Metadata = {
    title: "yunger.dev",
};

const getSearchPaths = unstable_cache(
    async () => {
        const paths: Path[] = [
            ...listPosts({ sorted: true }).map((post) => ({
                type: PathType.Writing,
                alt: post.slug,
                href: `/writing/${post.slug}`,
            })),
            ...getProjects().map((project) => {
                const primaryLink =
                    project.links.find((link) => link.isPrimary) ??
                    project.links[0];

                return {
                    type: PathType.Projects,
                    alt: project.title,
                    href: primaryLink.url,
                };
            }),
            ...getTools()
                .filter((tool) => !tool.unreleased)
                .map((tool) => ({
                    type: PathType.Tools,
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
    const paths = await getSearchPaths();

    return (
        <html lang="en" className="min-h-screen">
            <body
                className={`${jetBrainsMono.variable} font-mono text-sm antialiased selection:bg-[#81a1c19f] selection:text-nord-polar-1 dark:selection:bg-[#88c0d080] dark:selection:text-nord-snow-3`}
            >
                <div
                    id="grid-background"
                    className="fixed inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
                />
                <ThemeProvider
                    disableTransitionOnChange
                    enableSystem={false}
                    attribute="class"
                    defaultTheme="dark"
                >
                    <TopLoader />
                    <SettingsProvider>
                        <ViewsProvider>
                            <GlobalKeyboardShortcutsProvider>
                                <CommandBarProvider paths={paths}>
                                    <TooltipProvider>
                                        <Explorer paths={paths}>
                                            {children}
                                        </Explorer>
                                        <CommandBar />
                                        <StatusBar />
                                        <SearchDialog paths={paths} />
                                        <HelpDialog />
                                        <ShortcutsDialog />
                                    </TooltipProvider>
                                </CommandBarProvider>
                            </GlobalKeyboardShortcutsProvider>
                        </ViewsProvider>
                        <Toaster />
                    </SettingsProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
