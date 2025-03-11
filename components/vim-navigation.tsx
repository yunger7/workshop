"use client";

import { useEffect, useRef } from "react";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useSettingsContext } from "@/contexts/settings";

const LINE_HEIGHT = 24;
const SCROLL_INTERVAL = 100;

export function VimNavigation() {
    const { enableKeyboardShortcuts } = useSettingsContext();

    const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const activeKeyRef = useRef<string | null>(null);
    const keyBuffer = useRef<string[]>([]);
    const keyTimeout = useRef<NodeJS.Timeout | null>(null);

    const startScrolling = (direction: "up" | "down", key: string) => {
        if (scrollIntervalRef.current) return;

        const scrollFactor = (direction === "up" ? -1 : 1) * LINE_HEIGHT;

        activeKeyRef.current = key.toLowerCase();

        window.scrollBy({ top: scrollFactor, behavior: "instant" });

        scrollIntervalRef.current = setInterval(() => {
            window.scrollBy({ top: scrollFactor, behavior: "instant" });
        }, SCROLL_INTERVAL);
    };

    const stopScrolling = () => {
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
            activeKeyRef.current = null;
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "instant" });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "instant",
        });
    };

    const handleKeyboardShortcut = (key: string) => {
        if (!enableKeyboardShortcuts) {
            return;
        }

        if (keyTimeout.current) {
            clearTimeout(keyTimeout.current);
        }

        switch (key) {
            case "ArrowUp":
            case "k":
                startScrolling("up", key);
                break;
            case "ArrowDown":
            case "j":
                startScrolling("down", key);
                break;
            case "g":
                keyBuffer?.current?.push("g");

                if (
                    keyBuffer?.current?.length === 2 &&
                    keyBuffer?.current?.join("") === "gg"
                ) {
                    scrollToTop();
                    keyBuffer.current = [];
                    return;
                }

                keyTimeout.current = setTimeout(() => {
                    keyBuffer.current = [];
                }, 500);

                break;
            case "G":
                scrollToBottom();
                break;
            default:
                keyBuffer.current = [];
        }
    };

    useKeyboardShortcut(["k"], () => handleKeyboardShortcut("k"));
    useKeyboardShortcut(["ArrowUp"], () => handleKeyboardShortcut("ArrowUp"));
    useKeyboardShortcut(["j"], () => handleKeyboardShortcut("j"));
    useKeyboardShortcut(["ArrowDown"], () =>
        handleKeyboardShortcut("ArrowDown"),
    );
    useKeyboardShortcut(["Shift", "g"], () => handleKeyboardShortcut("G"));
    useKeyboardShortcut(["g"], () => handleKeyboardShortcut("g"));

    useEffect(() => {
        return () => {
            if (keyTimeout.current) {
                clearTimeout(keyTimeout.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() !== "g") {
                keyBuffer.current = [];
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const handleKeyUp = (event: KeyboardEvent) => {
            if (
                activeKeyRef.current &&
                event.key.toLowerCase() === activeKeyRef.current
            ) {
                stopScrolling();
            }
        };

        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keyup", handleKeyUp);
            stopScrolling();
        };
    }, []);

    return null;
}
