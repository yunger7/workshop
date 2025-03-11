import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { jetBrainsMono } from "@/app/fonts";
import { ThemeProvider } from "@/contexts/theme";
import { GlobalKeyboardShortcutsProvider } from "@/contexts/global-keyboard-shortcuts";
import { ViewsProvider } from "@/contexts/views";
import { SettingsProvider } from "@/contexts/settings";
import { CommandBarProvider } from "@/contexts/command-bar";
import {
    RouteTransitionsProvider,
    RouteTransitionsContainer,
} from "@/contexts/route-transitions";
import { Path, PathType } from "@/types/path";
import { listPosts } from "@/lib/data/writing";
import { getProjects } from "@/lib/data/projects";
import { getTools } from "@/lib/data/tools";
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
    title: {
        default: "yunger.dev",
        template: "%s | yunger.dev",
    },
    description:
        "A digital craftsman's workshop — a cozy place filled with tools, projects, writing, and more.",
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
                <ThemeProvider
                    disableTransitionOnChange
                    enableSystem={false}
                    attribute="class"
                    defaultTheme="dark"
                >
                    <div className="fixed inset-0 -z-10 h-full w-full bg-background before:absolute before:inset-0 before:bg-[linear-gradient(#5E81AC22_1px,transparent_1px),linear-gradient(90deg,#5E81AC22_1px,transparent_1px),linear-gradient(#5E81AC11_1px,transparent_1px),linear-gradient(90deg,#5E81AC11_1px,transparent_1px)] before:bg-[125px_125px,125px_125px,25px_25px,25px_25px] before:bg-left before:content-['']" />
                    <RouteTransitionsProvider>
                        <SettingsProvider>
                            <ViewsProvider>
                                <GlobalKeyboardShortcutsProvider>
                                    <CommandBarProvider paths={paths}>
                                        <TooltipProvider>
                                            <Explorer paths={paths}>
                                                <RouteTransitionsContainer>
                                                    {children}
                                                </RouteTransitionsContainer>
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
                    </RouteTransitionsProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
