import { useEffect } from "react";

type ShortcutHandler = () => void;

type Options = {
    routesBlacklist?: Array<string>;
    allowInInput?: boolean;
};

const shortcuts = new Map<
    string,
    { callback: ShortcutHandler; options?: Options }
>();

function handleGlobalKeyPress(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const inInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

    const matches: Array<{ callback: ShortcutHandler; specificity: number }> =
        [];
    const pathname = window.location.pathname;
    const os = navigator.platform?.toLowerCase().includes("mac")
        ? "macos"
        : "windows";
    const modKey = os === "macos" ? event.metaKey : event.ctrlKey;

    shortcuts.forEach(({ callback, options }, keyCombination) => {
        if (options?.routesBlacklist?.includes(pathname)) return;
        if (inInput && !options?.allowInInput) return;

        const keys = keyCombination.split("+");
        const isShortcutPressed = keys.every((key) => {
            switch (key.toLowerCase()) {
                case "mod":
                    return modKey;
                case "cmd":
                    return event.metaKey;
                case "ctrl":
                    return event.ctrlKey;
                case "alt":
                    return event.altKey;
                case "shift":
                    return event.shiftKey;
                default:
                    return event.key.toLowerCase() === key.toLowerCase();
            }
        });

        if (isShortcutPressed) {
            matches.push({ callback, specificity: keys.length });
        }
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

    useEffect(() => {
        if (!shortcuts.size) {
            window.addEventListener("keydown", handleGlobalKeyPress);
        }

        shortcuts.set(key, { callback, options });

        return () => {
            shortcuts.delete(key);
            if (!shortcuts.size) {
                window.removeEventListener("keydown", handleGlobalKeyPress);
            }
        };
    }, [key, callback, options]);
}
