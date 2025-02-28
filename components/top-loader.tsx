"use client";

import NextTopLoader from "nextjs-toploader";
import { useTheme } from "@/hooks/use-theme";

export function TopLoader() {
    const { theme } = useTheme();

    const ThemeColorMap: Record<string, string> = {
        light: "#2e3440",
        dark: "#eceff4",
    };

    const color = !!theme ? ThemeColorMap[theme] : "#5e81ac";

    return <NextTopLoader color={color} showSpinner={false} />;
}
