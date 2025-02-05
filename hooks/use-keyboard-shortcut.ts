import { useEffect } from "react";

type ShortcutHandler = () => void;

type Options = {
    routesBlacklist?: Array<string>;
};

const shortcuts = new Map<
    string,
    { callback: ShortcutHandler; options?: Options }
>();

function handleGlobalKeyPress(event: KeyboardEvent) {
    shortcuts.forEach(({ callback, options }, keyCombination) => {
        const pathname = window.location.pathname;
        const os = navigator.platform?.toLowerCase().includes("mac")
            ? "macos"
            : "windows";

        if (options?.routesBlacklist?.includes(pathname)) {
            return;
        }

        const modKey = os === "macos" ? event.metaKey : event.ctrlKey;

        const isShortcutPressed = keyCombination.split("+").every((key) => {
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
            event.preventDefault();
            callback();
        }
    });
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
