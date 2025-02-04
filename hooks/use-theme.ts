"use client";

import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
    const { theme, setTheme, ...other } = useNextTheme();

    function toggleTheme() {
        setTheme(theme === "light" ? "dark" : "light");
    }

    return {
        ...other,
        theme,
        setTheme,
        toggleTheme,
    };
}
