import { useEffect } from "react";
import { useSettingsContext } from "@/contexts/settings";

type ShortcutHandler = () => void;

type Options = {
    routesBlacklist?: string[];
    allowInInput?: boolean;
    allowInDialog?: boolean;
    triggerCondition?: () => boolean;
};

const shortcuts = new Map<
    string,
    Array<{ callback: ShortcutHandler; options?: Options }>
>();

const MODIFIER_KEYS = ["mod", "cmd", "ctrl", "alt", "shift"];

function isKeyMatch(event: KeyboardEvent, key: string, os: string): boolean {
    const lowerKey = key.toLowerCase();

    if (MODIFIER_KEYS.includes(lowerKey)) {
        switch (lowerKey) {
            case "mod":
                return os === "macos" ? event.metaKey : event.ctrlKey;
            case "cmd":
                return event.metaKey;
            case "ctrl":
                return event.ctrlKey;
            case "alt":
                return event.altKey;
            case "shift":
                return event.shiftKey;
        }
    }
    if (lowerKey === "space") {
        return event.key === " ";
    }

    return event.key.toLowerCase() === lowerKey;
}

function anyModifierActive(event: KeyboardEvent): boolean {
    return event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;
}

function handleGlobalKeyPress(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const inInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
    const isDialogOpen = document.activeElement?.closest('[role="dialog"]');
    const matches: Array<{ callback: ShortcutHandler; specificity: number }> =
        [];
    const pathname = window.location.pathname;
    const os = navigator.platform?.toLowerCase().includes("mac")
        ? "macos"
        : "windows";

    shortcuts.forEach((handlers, keyCombination) => {
        handlers.forEach(({ callback, options }) => {
            if (options?.routesBlacklist?.includes(pathname)) return;
            if (inInput && !options?.allowInInput) return;
            if (isDialogOpen && !options?.allowInDialog) return;

            const keys = keyCombination.split("+");
            const isShortcutPressed = keys.every((key) =>
                isKeyMatch(event, key, os),
            );

            if (isShortcutPressed) {
                const requiresModifier = keys.some((key) =>
                    MODIFIER_KEYS.includes(key.toLowerCase()),
                );

                if (!requiresModifier && anyModifierActive(event)) {
                    return;
                }

                if (
                    typeof options?.triggerCondition === "function" &&
                    !options.triggerCondition()
                ) {
                    return;
                }

                if (isDialogOpen && options?.allowInDialog) {
                    matches.push({ callback, specificity: keys.length });
                } else if (!isDialogOpen && !options?.allowInDialog) {
                    matches.push({ callback, specificity: keys.length });
                }
            }
        });
    });

    if (matches.length) {
        const maxSpecificity = Math.max(
            ...matches.map((match) => match.specificity),
        );
        const mostSpecific = matches.filter(
            (match) => match.specificity === maxSpecificity,
        );

        event.preventDefault();
        mostSpecific.forEach((match) => match.callback());
    }
}

export function useKeyboardShortcut(
    keyCombination: string[],
    callback: ShortcutHandler,
    options?: Options,
) {
    const key = keyCombination.join("+");
    const { enableKeyboardShortcuts } = useSettingsContext();

    useEffect(() => {
        if (!enableKeyboardShortcuts) return;

        if (!shortcuts.size) {
            window.addEventListener("keydown", handleGlobalKeyPress);
        }

        if (!shortcuts.has(key)) {
            shortcuts.set(key, []);
        }

        shortcuts.get(key)?.push({ callback, options });

        return () => {
            const handlers = shortcuts.get(key) || [];
            const filteredHandlers = handlers.filter(
                (h) => h.callback !== callback,
            );
            if (filteredHandlers.length) {
                shortcuts.set(key, filteredHandlers);
            } else {
                shortcuts.delete(key);
            }

            if (!shortcuts.size) {
                window.removeEventListener("keydown", handleGlobalKeyPress);
            }
        };
    }, [key, callback, options, enableKeyboardShortcuts]);
}
