"use client";

import { resolve } from "path";
import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";
import { cn, removeTrailingSlash } from "@/lib/utils";
import { useViewsContext } from "@/contexts/views";
import { useSettingsContext } from "@/contexts/settings";
import { useCommandBarContext } from "@/contexts/command-bar";
import { TerminalInput } from "@/components/terminal-input";

export function CommandBar() {
    const pathname = usePathname();
    const { enableStatusBar } = useSettingsContext();

    const inputRef = useRef<HTMLInputElement>(null);
    const commandBarRef = useRef<HTMLDivElement>(null);

    const { isCommandBarOpen } = useViewsContext();
    const {
        availableCommands,
        pathSuggestions,
        commandType,
        commandValue,
        setCommandValue,
        suggestions,
        setSuggestions,
        selectedSuggestionIndex,
        setSelectedSuggestionIndex,
        commandOutput,
        executeCommand,
        resetCommand,
    } = useCommandBarContext();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            executeCommand(commandType + commandValue);
        } catch (error) {
            console.error("Error executing command:", error);
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setCommandValue(value);

        if (commandType === ":" && value.length > 0) {
            let filteredSuggestions: string[] = [];

            if (value.startsWith("!cd ")) {
                const pathValue = value.replaceAll("!cd ", "") ?? "/";

                const formatPathSuggestion = (
                    path: string,
                    pathValue: string,
                ): string => {
                    if (pathValue.startsWith("~")) {
                        return path === "/home"
                            ? "~/"
                            : path.replace("/home", "~");
                    }

                    if (pathValue.startsWith(".")) {
                        return path.replace(
                            resolve(`/home${pathname}`, pathValue),
                            removeTrailingSlash(pathValue),
                        );
                    }

                    return path;
                };

                filteredSuggestions = pathSuggestions
                    .map((path) => formatPathSuggestion(path, pathValue))
                    .filter((path) => path.startsWith(pathValue))
                    .map((path) => `!cd ${path}`);
            } else {
                filteredSuggestions = availableCommands.filter((cmd) =>
                    cmd.startsWith(value),
                );
            }

            setSuggestions(filteredSuggestions);
            setSelectedSuggestionIndex(-1);
        } else {
            setSuggestions([]);
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (suggestions.length === 0) return;

        const updateSelectedSuggestion = (direction: "up" | "down") => {
            const newIndex =
                direction === "up"
                    ? (selectedSuggestionIndex - 1 + suggestions.length) %
                      suggestions.length
                    : (selectedSuggestionIndex + 1) % suggestions.length;

            setSelectedSuggestionIndex(newIndex);
            setCommandValue(suggestions[newIndex]);
        };

        const handlers: Record<string, () => void> = {
            Tab: () => updateSelectedSuggestion(event.shiftKey ? "up" : "down"),
            ArrowUp: () => updateSelectedSuggestion("up"),
            ArrowDown: () => updateSelectedSuggestion("down"),
        };

        if (event.key in handlers) {
            event.preventDefault();
            handlers[event.key]();
        }
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                commandBarRef.current &&
                !commandBarRef.current.contains(event.target as Node)
            ) {
                resetCommand(true);
            }
        }

        if (isCommandBarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isCommandBarOpen, resetCommand]);

    useEffect(() => {
        if (isCommandBarOpen) {
            inputRef.current?.focus();
        }
    }, [isCommandBarOpen]);

    if (!isCommandBarOpen && !commandOutput) {
        return null;
    }

    const showSuggestions =
        commandType === ":" &&
        commandValue.replaceAll("!", "").length > 0 &&
        suggestions.length > 0 &&
        (suggestions.length !== 1 || suggestions[0] !== commandValue);

    return (
        <div
            ref={commandBarRef}
            className={cn(
                "fixed left-0 right-0 select-none bg-background",
                enableStatusBar ? "bottom-6" : "bottom-0",
            )}
        >
            {isCommandBarOpen ? (
                <form
                    onSubmit={handleSubmit}
                    className="relative flex items-center p-2"
                >
                    <span>{commandType}</span>
                    <TerminalInput
                        ref={inputRef}
                        value={commandValue}
                        onKeyDown={handleKeyDown}
                        onChange={handleChange}
                    />
                    {showSuggestions && (
                        <ul className="absolute bottom-full border bg-background p-2">
                            {suggestions
                                .slice(0, 6)
                                .map((suggestion, index) => (
                                    <li
                                        key={suggestion}
                                        className={cn("p-1", {
                                            "bg-accent text-accent-foreground":
                                                index ===
                                                selectedSuggestionIndex,
                                        })}
                                    >
                                        {suggestion
                                            .replaceAll("!cd ", "")
                                            .replaceAll("!", "")}
                                    </li>
                                ))}
                        </ul>
                    )}
                </form>
            ) : (
                <pre className="p-2">{commandOutput}</pre>
            )}
        </div>
    );
}
