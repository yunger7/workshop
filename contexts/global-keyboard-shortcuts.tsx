"use client";

import { createContext } from "react";
import { useRouter } from "nextjs-toploader/app";

import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useTheme } from "@/hooks/use-theme";

export const GlobalKeyboardShortcutsContext = createContext<null>(null);

export function GlobalKeyboardShortcutsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { toggleTheme } = useTheme();

    useKeyboardShortcut(["mod", "j"], toggleTheme);

    useKeyboardShortcut(["Escape"], () => router.back());
    useKeyboardShortcut(["Backspace"], () => router.back());
    useKeyboardShortcut(["h"], () => router.back());

    return (
        <GlobalKeyboardShortcutsContext.Provider value={null}>
            {children}
        </GlobalKeyboardShortcutsContext.Provider>
    );
}
