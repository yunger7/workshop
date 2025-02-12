import React from "react";
import { cn } from "@/lib/utils";

export function Article({
    children,
    className,
    ...props
}: React.ComponentPropsWithoutRef<"article">) {
    return (
        <article
            className={cn(
                "prose prose-sm prose-zinc mb-8 max-w-none dark:prose-invert",
                className,
            )}
            {...props}
        >
            {children}
        </article>
    );
}
