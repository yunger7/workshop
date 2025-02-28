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

export function CommandBar() {
    const inputRef = useRef<HTMLInputElement>(null);
    const commandBarRef = useRef<HTMLDivElement>(null);

    const pathname = usePathname();

    const [commandValue, setCommandValue] = useState("");
    const [commandType, setCommandType] = useState<CommandType>("");
    const [commandOutput, setCommandOutput] = useState<string | null>(null);

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

    const [searchResults, setSearchResults] = useState<HTMLElement[]>([]);
    const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
    const [lastSearchCommand, setLastSearchCommand] = useState<
        "/" | "?" | null
    >(null);

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
        if (isCommandBarOpen) return;

        setIsCommandBarOpen(true);
        setCommandType(type);
    }

    function executeCommand(fullCommand: string) {
        try {
            if (!fullCommand) return;

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
            else if (fullCommand.startsWith("/")) {
                setLastSearchCommand("/");
                executeSearch(fullCommand.substring(1).trim(), "forward");
            } else if (fullCommand.startsWith("?")) {
                setLastSearchCommand("?");
                executeSearch(fullCommand.substring(1).trim(), "backward");
            }

            resetCommand();
        } catch (error) {
            console.error("Error executing command:", error);
            setCommandOutput(
                `Error executing command: ${(error as Error).message}`,
            );
        }
    }

    const clearSearchHighlights = useCallback(() => {
        document.querySelectorAll(".search-highlight").forEach((el) => {
            const parent = el.parentNode;

            if (parent) {
                const textNode = document.createTextNode(el.textContent || "");

                parent.replaceChild(textNode, el);
                parent.normalize();
            }
        });
        setSearchResults([]);
        setCurrentSearchIndex(-1);
        setCommandOutput(null);
    }, []);

    const scrollToElement = useCallback((element: HTMLElement) => {
        document.querySelectorAll(".search-highlight-active").forEach((el) => {
            el.classList.remove("search-highlight-active");
        });

        element.classList.add("search-highlight-active");

        element.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }, []);

    const executeSearch = useCallback(
        (
            pattern: string,
            direction: "forward" | "backward",
            liveSearch = false,
        ) => {
            clearSearchHighlights();

            if (!pattern) {
                return;
            }

            const textNodes: { node: Text; start: number; text: string }[] = [];

            const isUnsearchable = (element: Element | null): boolean => {
                if (!element) return false;

                const unsearchableTags = new Set(["SCRIPT", "STYLE"]);
                const unsearchableClasses = [
                    ".unsearchable",
                    ".select-none",
                    ".hidden",
                    ".invisible",
                    "[data-state='closed']",
                ];

                return (
                    unsearchableTags.has(element.tagName) ||
                    unsearchableClasses.some((cls) => element.closest(cls))
                );
            };

            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) =>
                        isUnsearchable(node.parentElement)
                            ? NodeFilter.FILTER_REJECT
                            : NodeFilter.FILTER_ACCEPT,
                },
            );

            let node: Node | null;

            while ((node = walker.nextNode() as Text)) {
                const text = node.textContent || "";
                let position = -1;

                while (
                    (position = text
                        .toLowerCase()
                        .indexOf(pattern.toLowerCase(), position + 1)) !== -1
                ) {
                    textNodes.push({
                        node: node as Text,
                        start: position,
                        text: text.substring(
                            position,
                            position + pattern.length,
                        ),
                    });
                }
            }

            const highlights: HTMLElement[] = [];

            textNodes.forEach(({ node, start }) => {
                if (start < node.length) {
                    const range = document.createRange();
                    try {
                        range.setStart(node, start);
                        range.setEnd(
                            node,
                            Math.min(start + pattern.length, node.length),
                        );

                        const span = document.createElement("span");
                        span.className = "search-highlight";

                        range.surroundContents(span);
                        highlights.push(span);
                    } catch (e) {
                        console.warn("Could not highlight match:", e);
                    }
                }
            });

            setSearchResults(highlights);

            if (highlights.length > 0) {
                const index =
                    direction === "forward" ? 0 : highlights.length - 1;
                setCurrentSearchIndex(index);

                if (!liveSearch) {
                    scrollToElement(highlights[index]);
                }

                setCommandOutput(`Found ${highlights.length} matches`);
            } else {
                setCurrentSearchIndex(-1);
                setCommandOutput(`Pattern not found: ${pattern}`);
            }
        },
        [clearSearchHighlights, scrollToElement],
    );

    const navigateSearchResults = useCallback(
        (direction: "next" | "previous") => {
            if (searchResults.length === 0) return;

            console.log("here");

            let newIndex = currentSearchIndex;

            if (direction === "next") {
                newIndex = (currentSearchIndex + 1) % searchResults.length;
            } else {
                newIndex =
                    (currentSearchIndex - 1 + searchResults.length) %
                    searchResults.length;
            }

            setCurrentSearchIndex(newIndex);
            scrollToElement(searchResults[newIndex]);
        },
        [currentSearchIndex, searchResults, scrollToElement],
    );

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

        event.preventDefault();

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
                updateSelectedSuggestion(event.shiftKey ? "up" : "down");
                break;

            case "ArrowUp":
                updateSelectedSuggestion("up");
                break;

            case "ArrowDown":
                updateSelectedSuggestion("down");
                break;
        }
    }

    useKeyboardShortcut(["Shift", ":"], () => openCommandBar(":"));
    useKeyboardShortcut(["/"], () => openCommandBar("/"));
    useKeyboardShortcut(["?"], () => openCommandBar("?"));
    useKeyboardShortcut(["n"], () =>
        navigateSearchResults(lastSearchCommand === "?" ? "previous" : "next"),
    );
    useKeyboardShortcut(["Shift", "n"], () =>
        navigateSearchResults(lastSearchCommand === "?" ? "next" : "previous"),
    );
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

    useEffect(() => {
        if ((commandType === "/" || commandType === "?") && commandValue) {
            const direction = commandType === "/" ? "forward" : "backward";

            const timeoutId = setTimeout(() => {
                try {
                    executeSearch(commandValue, direction, true);
                } catch (error) {
                    console.error("Error executing search:", error);
                }
            }, 50);

            return () => clearTimeout(timeoutId);
        }
    }, [commandType, commandValue, executeSearch]);

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
