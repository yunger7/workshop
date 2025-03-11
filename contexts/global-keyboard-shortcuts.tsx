"use client";

import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-transition-router";

import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useViewsContext } from "@/contexts/views";
import { useTheme } from "@/hooks/use-theme";

type GlobalKeyboardShortcutsContextType = {
    goBack: () => void;
};

export const GlobalKeyboardShortcutsContext =
    createContext<GlobalKeyboardShortcutsContextType | null>(null);

export function useGlobalKeyboardShortcuts() {
    const context = useContext(GlobalKeyboardShortcutsContext);

    if (!context) {
        throw new Error(
            "useGlobalKeyboardShortcuts must be used within a GlobalKeyboardShortcutsProvider",
        );
    }

    return context;
}

export function GlobalKeyboardShortcutsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useTransitionRouter();
    const pathname = usePathname();
    const {
        setIsSearchDialogOpen,
        setIsHelpDialogOpen,
        setIsShortcutsDialogOpen,
    } = useViewsContext();
    const { toggleTheme } = useTheme();

    useKeyboardShortcut(["Space"], () => setIsShortcutsDialogOpen(true));

    useKeyboardShortcut(
        ["mod", "k"],
        () => setIsSearchDialogOpen((prev) => !prev),
        {
            allowInInput: true,
        },
    );

    useKeyboardShortcut(
        ["mod", "h"],
        () => setIsHelpDialogOpen((prev) => !prev),
        {
            allowInInput: true,
        },
    );

    useKeyboardShortcut(["mod", "j"], toggleTheme, {
        allowInInput: true,
    });

    const goBack = () => {
        if (pathname === "/" || pathname === "") return;

        const cleanPath =
            pathname.endsWith("/") && pathname !== "/"
                ? pathname.slice(0, -1)
                : pathname;

        const segments = cleanPath.split("/");
        segments.pop();
        const parentPath = segments.join("/") || "/";

        router.push(parentPath);
    };

    useKeyboardShortcut(["Backspace"], goBack);
    useKeyboardShortcut(["Escape"], goBack);
    useKeyboardShortcut(["h"], goBack, {
        triggerCondition: () =>
            !document.querySelector(".menu-list:not(.menu-explorer)"),
    });
    useKeyboardShortcut(["ArrowLeft"], goBack, {
        triggerCondition: () =>
            !document.querySelector(".menu-list:not(.menu-explorer)"),
    });

    return (
        <GlobalKeyboardShortcutsContext.Provider
            value={{
                goBack,
            }}
        >
            {children}
        </GlobalKeyboardShortcutsContext.Provider>
    );
}
