"use client";

import { usePathname } from "next/navigation";
import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useViewsContext } from "@/contexts/views";
import { useGlobalKeyboardShortcuts } from "@/contexts/global-keyboard-shortcuts";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useTheme } from "@/hooks/use-theme";
import { TerminalInput } from "@/components/terminal-input";

type CommandType = ":" | "/" | "?" | "";
type HistoryDirection = "up" | "down";

export function CommandBar() {
    const inputRef = useRef<HTMLInputElement>(null);
    const commandBarRef = useRef<HTMLDivElement>(null);

    const pathname = usePathname();

    const [commandValue, setCommandValue] = useState("");
    const [commandType, setCommandType] = useState<CommandType>("");
    const [commandOutput, setCommandOutput] = useState<string | null>(null);

    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

    const { goBack } = useGlobalKeyboardShortcuts();
    const { isCommandBarOpen, setIsCommandBarOpen } = useViewsContext();
    const { theme, setTheme, toggleTheme } = useTheme();

    const commands: Record<string, () => string | void> = {
        "toggle theme": () => {
            toggleTheme();
            return `${theme === "dark" ? "Light" : "Dark"} mode enabled`;
        },
        "set dark": () => {
            setTheme("dark");
            return "Dark mode enabled";
        },
        "set light": () => {
            setTheme("light");
            return "Light mode enabled";
        },
        "q": quit,
        "wq": quit,
        "x": quit,
    };

    const availableCommands = Object.keys(commands);

    const resetCommand = useCallback(
        (clearOutput = false) => {
            setIsCommandBarOpen(false);
            setCommandValue("");
            setCommandType("");
            setSuggestions([]);
            setSelectedSuggestionIndex(-1);
            if (clearOutput) {
                setCommandOutput(null);
            }
        },
        [setIsCommandBarOpen],
    );

    function quit() {
        return pathname === "/" ? window.close() : goBack();
    }

    function openCommandBar(type: CommandType) {
        setIsCommandBarOpen(true);
        setCommandType(type);
    }

    function executeCommand(fullCommand: string) {
        try {
            if (!fullCommand) return;

            addCommandToHistory(fullCommand);

            if (fullCommand.startsWith(":")) {
                const command = fullCommand
                    .substring(1)
                    .trim()
                    .replaceAll("!", "");

                if (command in commands) {
                    const output = commands[command]();
                    setCommandOutput(output ?? null);
                }
            }
            // else if (fullCommand.startsWith(":!")) {
            //     const command = fullCommand.substring(2).trim()
            //     executeShellCommand(command);
            // }
            // else if (fullCommand.startsWith("/")) {
            //     executeSearch(fullCommand.substring(1).trim(), "forward");
            // } else if (fullCommand.startsWith("?")) {
            //     executeSearch(fullCommand.substring(1).trim(), "backward");
            // } else if (fullCommand === "n") {
            //     navigateSearchResults("next");
            //     return;
            // } else if (fullCommand === "N") {
            //     navigateSearchResults("previous");
            //     return;
            // }

            resetCommand();
        } catch (error) {
            console.error("Error executing command:", error);
            setCommandOutput(
                `Error executing command: ${(error as Error).message}`,
            );
        }
    }

    function addCommandToHistory(command: string) {
        if (history.length === 0 || history[0] !== command) {
            setHistory((prev) => [command, ...prev].slice(0, 50));
        }
    }

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
            const filtered = availableCommands.filter((cmd) =>
                cmd.startsWith(value),
            );
            setSuggestions(filtered);
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

        switch (event.key) {
            case "Tab":
                event.preventDefault();
                updateSelectedSuggestion(event.shiftKey ? "up" : "down");
                break;

            case "ArrowUp":
                event.preventDefault();
                updateSelectedSuggestion("up");
                break;

            case "ArrowDown":
                event.preventDefault();
                updateSelectedSuggestion("down");
                break;
        }
    }

    useKeyboardShortcut(["Shift", ":"], () => openCommandBar(":"));
    useKeyboardShortcut(["/"], () => openCommandBar("/"));
    useKeyboardShortcut(["?"], () => openCommandBar("?"));
    useKeyboardShortcut(["Escape"], () => resetCommand(true), {
        allowInInput: true,
    });

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
        commandValue.length > 0 &&
        suggestions.length > 0 &&
        (suggestions.length !== 1 || suggestions[0] !== commandValue);

    return (
        <div
            ref={commandBarRef}
            className="fixed bottom-6 left-0 right-0 select-none bg-background"
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
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={suggestion}
                                    className={cn("p-1", {
                                        "bg-accent text-accent-foreground":
                                            index === selectedSuggestionIndex,
                                    })}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </form>
            ) : (
                <div className="p-2">{commandOutput}</div>
            )}
        </div>
    );
}
