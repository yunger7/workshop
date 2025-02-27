"use client";

import { useRef, useEffect } from "react";
import { useViewsContext } from "@/contexts/views";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { TerminalInput } from "@/components/terminal-input";

export function CommandBar() {
    const inputRef = useRef<HTMLInputElement>(null);
    const commandBarRef = useRef<HTMLDivElement>(null);

    const { isCommandBarOpen, setIsCommandBarOpen } = useViewsContext();

    useKeyboardShortcut(["Shift", ":"], () => setIsCommandBarOpen(true));
    useKeyboardShortcut(["Escape"], () => setIsCommandBarOpen(false), {
        allowInInput: true,
    });

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                commandBarRef.current &&
                !commandBarRef.current.contains(event.target as Node)
            ) {
                setIsCommandBarOpen(false);
            }
        }

        if (isCommandBarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isCommandBarOpen, setIsCommandBarOpen]);

    useEffect(() => {
        if (isCommandBarOpen) {
            inputRef.current?.focus();
        }
    }, [isCommandBarOpen]);

    if (!isCommandBarOpen) {
        return null;
    }

    return (
        <div
            ref={commandBarRef}
            className="fixed bottom-6 left-0 right-0 select-none bg-background"
        >
            <form className="flex select-none items-center p-2">
                <span>:</span>
                <TerminalInput ref={inputRef} />
            </form>
        </div>
    );
}
