"use client";

import React, { useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { IconStar } from "@tabler/icons-react";
import { useSettingsContext } from "@/contexts/settings";

type StarsProps = {
    count: number;
};

export function Stars({ count }: StarsProps) {
    const { enableAnimations } = useSettingsContext();
    const controls = useAnimation();
    const tapCountRef = useRef(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleTap = async () => {
        if (!enableAnimations) return;

        if (timerRef.current) clearTimeout(timerRef.current);

        tapCountRef.current += 1;

        if (tapCountRef.current === 5) {
            await controls.start({
                scale: [1, 1.3, 1],
                rotate: [0, 20, -20, 0],
                transition: { duration: 0.8 },
            });

            tapCountRef.current = 0;
        } else {
            await controls.start({ rotate: 10, transition: { duration: 0.1 } });
            await controls.start({ rotate: 0, transition: { duration: 0.1 } });
        }

        timerRef.current = setTimeout(() => {
            tapCountRef.current = 0;
        }, 2000);
    };

    return (
        <motion.div
            onTapStart={handleTap}
            className="flex select-none items-center gap-1 text-sm focus:outline-none"
            tabIndex={-1}
        >
            <motion.span
                animate={controls}
                tabIndex={-1}
                className="focus:outline-none"
            >
                <span className="sr-only">
                    {count} star{count > 1 ? "s" : ""} on GitHub
                </span>
                <IconStar className="size-4" />
            </motion.span>
            {count}
        </motion.div>
    );
}
