import Link from "next/link";
import React from "react";
import { Icon } from "@/types/icon";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/back-button";

type Action = {
    label: string;
    icon: Icon;
    href: string;
};

type LayoutProps = Omit<React.ComponentPropsWithoutRef<"main">, "children"> & {
    children: React.ReactNode;
    title: string;
    description?: string;
    icon?: Icon;
    actions?: Action[];
};

export function Layout({
    children,
    title,
    description,
    icon: IconComponent,
    actions = [],
}: LayoutProps) {
    return (
        <main className="mx-auto my-16 max-w-screen-md px-8">
            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <BackButton>
                        <h1 className="flex items-center gap-2 text-left text-2xl font-bold group-hover:cursor-pointer">
                            {IconComponent && (
                                <IconComponent className="size-6" />
                            )}
                            {title}
                        </h1>
                    </BackButton>
                    <div className="flex items-center gap-2">
                        {actions.map(({ label, icon: IconComponent, href }) => {
                            const isExternal = href.startsWith("http");

                            const content = (
                                <>
                                    <span className="sr-only">{label}</span>
                                    <IconComponent className="size-6" />
                                </>
                            );

                            return (
                                <Tooltip key={label}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            asChild
                                            size="icon"
                                            variant="outline"
                                        >
                                            {isExternal ? (
                                                <a href={href} target="_blank">
                                                    {content}
                                                </a>
                                            ) : (
                                                <Link href={href}>
                                                    {content}
                                                </Link>
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{label}</p>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </div>
                </div>
                {description && (
                    <p className="mt-1 text-muted-foreground">{description}</p>
                )}
            </div>
            {children}
        </main>
    );
}
