import { usePathname } from "next/navigation";
import { useEffect, useCallback } from "react";
import { useOS } from "@/hooks/use-os";

type ShortcutHandler = () => void;

type Options = {
    routesBlacklist?: Array<string>;
};

export function useKeyboardShortcut(
    keyCombination: string[],
    callback: ShortcutHandler,
    options?: Options,
) {
    const pathname = usePathname();
    const os = useOS();

    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            const modKey = os === "macos" ? event.metaKey : event.ctrlKey;

            if (options?.routesBlacklist?.includes(pathname)) {
                return;
            }

            const isShortcutPressed = keyCombination.every((key) => {
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
        },
        [keyCombination, callback, os],
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);
}
