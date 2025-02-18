import Link from "next/link";
import React from "react";
import { IconArrowLeft } from "@tabler/icons-react";
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
    actions?: Action[];
};

export function Layout({
    children,
    title,
    description,
    actions = [],
}: LayoutProps) {
    return (
        <main className="mx-auto my-16 max-w-screen-md px-10">
            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <BackButton>
                        <div className="group relative flex items-center">
                            <IconArrowLeft className="absolute left-0 top-1/2 -ml-7 size-5 -translate-y-1/2 opacity-40 transition-transform duration-200 group-hover:-translate-x-1" />
                            <h1 className="text-2xl font-bold group-hover:cursor-pointer">
                                {title}
                            </h1>
                        </div>
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
