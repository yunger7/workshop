"use client";

import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { toggleTheme } = useTheme();

    return (
        <Button variant="destructive" onClick={toggleTheme} className="mt-8">
            Toggle theme
        </Button>
    );
}
