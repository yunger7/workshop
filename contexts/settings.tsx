"use client";

import { createContext, useContext } from "react";
import { Settings } from "@/types/settings";
import { useLocalStorage } from "@/hooks/use-local-storage";

export type SettingsContextType = Settings & {
    toggleAnimations: () => void;
    toggleKeyboardShortcuts: () => void;
    toggleStatusBar: () => void;
    toggleGridBackground: () => void;
};

export const SettingsContext = createContext<SettingsContextType | null>(null);

export function useSettingsContext() {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error(
            "useSettingsContext must be used within a SettingsProvider",
        );
    }

    return context;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useLocalStorage<Settings>("settings", {
        enableAnimations: true,
        enableKeyboardShortcuts: true,
        enableStatusBar: true,
        enableGridBackground: true,
    });

    function toggleAnimations() {
        setSettings((prev) => ({
            ...prev,
            enableAnimations: !prev.enableAnimations,
        }));
    }

    function toggleKeyboardShortcuts() {
        setSettings((prev) => ({
            ...prev,
            enableKeyboardShortcuts: !prev.enableKeyboardShortcuts,
        }));
    }

    function toggleStatusBar() {
        setSettings((prev) => ({
            ...prev,
            enableStatusBar: !prev.enableStatusBar,
        }));
    }

    function toggleGridBackground() {
        setSettings((prev) => ({
            ...prev,
            enableGridBackground: !prev.enableGridBackground,
        }));
    }

    return (
        <SettingsContext.Provider
            value={{
                enableAnimations: settings.enableAnimations,
                toggleAnimations,
                enableKeyboardShortcuts: settings.enableKeyboardShortcuts,
                toggleKeyboardShortcuts,
                enableStatusBar: settings.enableStatusBar,
                toggleStatusBar,
                enableGridBackground: settings.enableGridBackground,
                toggleGridBackground,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}
