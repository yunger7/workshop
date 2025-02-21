"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import { IconRefresh } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

const iconVariants: Variants = {
    initial: { rotate: 0, transition: { duration: 0.3 } },
    hover: { rotate: 90, transition: { duration: 0.3 } },
    rotate: { rotate: [90, 450], transition: { duration: 0.6 } },
};

export type ViewBoxProps = React.ComponentPropsWithoutRef<"button"> & {
    children: React.ReactNode;
};

export type ViewBoxHandle = {
    controls: ReturnType<typeof useAnimation>;
};

export const ViewBox = forwardRef<ViewBoxHandle, ViewBoxProps>(
    ({ children, className }, ref) => {
        const controls = useAnimation();

        useImperativeHandle(
            ref,
            () => ({
                controls,
            }),
            [controls],
        );

        return (
            <motion.button
                className={cn(
                    "relative w-full rounded-md border bg-card p-4 text-center",
                    className,
                )}
                initial="initial"
                whileHover="hover"
            >
                <Tooltip>
                    <TooltipTrigger asChild>
                        <motion.div
                            className="absolute -right-7 top-[calc(50%-0.75rem)] -translate-y-1/2"
                            animate={controls}
                            variants={iconVariants}
                        >
                            <IconRefresh className="size-5 text-muted-foreground transition-colors duration-200 hover:text-foreground" />
                        </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        <p>Refresh</p>
                    </TooltipContent>
                </Tooltip>
                <pre>{children}</pre>
            </motion.button>
        );
    },
);

ViewBox.displayName = "ViewBox";
