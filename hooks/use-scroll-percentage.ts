"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function useScrollPercentage(): number | null {
    const pathname = usePathname();
    const [scrollPercentage, setScrollPercentage] = useState<number | null>(
        null,
    );

    useEffect(() => {
        const updateScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } =
                document.documentElement;

            const isScrollable = scrollHeight > clientHeight;
            if (!isScrollable) {
                setScrollPercentage(null);
                return;
            }

            const percent = Math.round(
                (scrollTop / (scrollHeight - clientHeight)) * 100,
            );
            setScrollPercentage(Math.round(percent / 5) * 5);
        };

        updateScroll();

        window.addEventListener("scroll", updateScroll);
        window.addEventListener("resize", updateScroll);

        return () => {
            window.removeEventListener("scroll", updateScroll);
            window.removeEventListener("resize", updateScroll);
        };
    }, [pathname]);

    return scrollPercentage;
}
