"use client";

import React, { Fragment } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import {
    IconGitBranch,
    IconHelp,
    IconHome,
    IconLoader,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { getEnvironment } from "@/lib/environment";
import { useScrollPercentage } from "@/hooks/use-scroll-percentage";
import { useViewsContext } from "@/contexts/views";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function StatusBarSection({ children }: { children: React.ReactNode }) {
    return <div className="flex h-full items-center">{children}</div>;
}

type StatusBarItemProps = {
    children: React.ReactNode;
    className?: string;
};

function StatusBarItem({ children, className }: StatusBarItemProps) {
    return (
        <span
            className={cn(
                "flex h-full select-none items-center gap-2 px-2",
                className,
            )}
        >
            {children}
        </span>
    );
}

export function StatusBar() {
    const pathname = usePathname();
    const router = useRouter();
    const scrollPercentage = useScrollPercentage();
    const { setIsHelpDialogOpen } = useViewsContext();

    const paths = pathname === "/" ? [""] : pathname.split("/");

    return (
        <div className="fixed bottom-0 left-0 right-0 flex h-6 items-center justify-between bg-card">
            <StatusBarSection>
                <Breadcrumb className="h-full">
                    <BreadcrumbList className="h-full">
                        {paths.map((path, index) => {
                            const href =
                                paths.slice(0, index + 1).join("/") || "/";

                            const isHome = href === "/";

                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem
                                        className={cn("h-full", {
                                            "hidden sm:flex": index >= 2,
                                        })}
                                    >
                                        <BreadcrumbLink
                                            asChild
                                            className="h-full"
                                        >
                                            <Button
                                                variant="ghost"
                                                className="h-full rounded-none px-2 py-0"
                                                onClick={() =>
                                                    router.push(href)
                                                }
                                            >
                                                {isHome ? (
                                                    <IconHome className="size-4" />
                                                ) : (
                                                    path
                                                )}
                                            </Button>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {index !== paths.length - 1 && (
                                        <BreadcrumbSeparator
                                            className={cn({
                                                "hidden sm:flex": index >= 1,
                                            })}
                                        />
                                    )}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </StatusBarSection>
            <StatusBarSection>
                {scrollPercentage !== null && (
                    <StatusBarItem>
                        <IconLoader className="size-4" />
                        {scrollPercentage}%
                    </StatusBarItem>
                )}
                <StatusBarItem>
                    <IconGitBranch className="size-4" />
                    {getEnvironment()}
                </StatusBarItem>
                <Button
                    variant="ghost"
                    className="h-full rounded-none px-2 py-0"
                    onClick={() => setIsHelpDialogOpen(true)}
                >
                    <IconHelp className="size-4" />
                </Button>
            </StatusBarSection>
        </div>
    );
}
