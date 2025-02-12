"use client";

import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
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
    const router = useRouter();
    const pathname = usePathname();
    const { toggleTheme } = useTheme();

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
    useKeyboardShortcut(["h"], goBack);
    useKeyboardShortcut(["ArrowLeft"], goBack);
    useKeyboardShortcut(["Escape"], goBack, {
        allowInInput: true,
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
