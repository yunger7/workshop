"use client";

import { useState, useEffect } from "react";
import { IconChevronUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useSettingsContext } from "@/contexts/settings";
import { Button } from "@/components/ui/button";

export function GoToTopButton() {
    const { enableStatusBar, enableAnimations } = useSettingsContext();

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 200) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <Button
            variant="secondary"
            size="icon"
            onClick={scrollToTop}
            className={cn(
                "fixed right-[1.5rem] transition-all duration-300 sm:right-[2rem]",
                {
                    "transform hover:scale-110 active:scale-95":
                        enableAnimations,
                },
                enableStatusBar
                    ? "bottom-[calc(1.5rem+1.5rem)] sm:bottom-[calc(1.5rem+2rem)]"
                    : "bottom-[1.5rem] sm:bottom-[2rem]",
                isVisible
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-16 opacity-0",
            )}
        >
            <span className="sr-only">Scroll to top</span>
            <IconChevronUp className="size-6" />
        </Button>
    );
}
