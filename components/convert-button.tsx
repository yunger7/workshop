"use client";

import {
    motion,
    useAnimation,
    AnimationControls,
    Variants,
} from "framer-motion";
import React, { forwardRef, useImperativeHandle } from "react";
import { IconRefresh } from "@tabler/icons-react";
import { Button, ButtonProps } from "@/components/ui/button";

export type ConvertButtonHandle = {
    controls: AnimationControls;
};

const iconVariants: Variants = {
    rotate: { rotate: 360, transition: { duration: 0.6 } },
};

export const ConvertButton = forwardRef<ConvertButtonHandle, ButtonProps>(
    ({ children, onClick, ...props }, ref) => {
        const controls = useAnimation();

        useImperativeHandle(
            ref,
            () => ({
                controls,
            }),
            [controls],
        );

        const handleClick = async (
            event: React.MouseEvent<HTMLButtonElement>,
        ) => {
            await controls.start("rotate").then(() => {
                controls.set({ rotate: 0 });
            });

            if (onClick) onClick(event);
        };

        return (
            <Button {...props} onClick={handleClick}>
                <motion.span animate={controls} variants={iconVariants}>
                    <IconRefresh />
                </motion.span>
                {children}
            </Button>
        );
    },
);

ConvertButton.displayName = "ConvertButton";
