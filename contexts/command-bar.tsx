"use client";

import { resolve } from "path";
import { usePathname } from "next/navigation";
import React, { createContext, useState, useCallback, useEffect } from "react";
import { useTransitionRouter } from "next-transition-router";
import { Path, basePaths } from "@/types/path";
import { removeTrailingSlash } from "@/lib/utils";
import { useGlobalKeyboardShortcuts } from "@/contexts/global-keyboard-shortcuts";
import { useViewsContext } from "@/contexts/views";
import { useTheme } from "@/hooks/use-theme";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

export type CommandType = ":" | "/" | "?" | "";

type CommandBarContextType = {
    availableCommands: string[];
    pathSuggestions: string[];
    commandType: CommandType;
    setCommandType: React.Dispatch<React.SetStateAction<CommandType>>;
    commandValue: string;
    setCommandValue: React.Dispatch<React.SetStateAction<string>>;
    suggestions: string[];
    setSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
    selectedSuggestionIndex: number;
    setSelectedSuggestionIndex: React.Dispatch<React.SetStateAction<number>>;
    commandOutput: string | null;
    setCommandOutput: React.Dispatch<React.SetStateAction<string | null>>;
    clearSearchHighlights: () => void;
    executeCommand: (fullCommand: string) => void;
    resetCommand: (clearSuggestions?: boolean) => void;
};

export const CommandBarContext = createContext<CommandBarContextType | null>(
    null,
);

export function useCommandBarContext() {
    const context = React.useContext(CommandBarContext);

    if (!context) {
        throw new Error(
            "useCommandBarContext must be used within a CommandBarProvider",
        );
    }

    return context;
}

type CommandBarProviderProps = {
    children: React.ReactNode;
    paths: Path[];
};

export function CommandBarProvider({
    paths,
    children,
}: CommandBarProviderProps) {
    const pathname = usePathname();
    const router = useTransitionRouter();

    const { goBack } = useGlobalKeyboardShortcuts();
    const { theme, setTheme, toggleTheme } = useTheme();
    const { isCommandBarOpen, setIsCommandBarOpen, setIsHelpDialogOpen } =
        useViewsContext();

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

    const workingDirectory = pathname === "/" ? "/home" : `/home${pathname}`;

    const commands: Record<string, (...args: string[]) => string | void> = {
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
        "help": () => setIsHelpDialogOpen(true),
        "!pwd": () => workingDirectory,
        "!clear": () => "",
        "!ls": () => {
            const filteredPaths = paths.filter((path) =>
                path.href.startsWith(pathname),
            );
            return filteredPaths.map((path) => path.href).join("\n");
        },
        "!cd": (inputPath: string) => {
            let resolvedPath = inputPath;

            if (!inputPath || removeTrailingSlash(inputPath) === "~") {
                resolvedPath = "/";
            } else if (inputPath.startsWith("~/")) {
                resolvedPath = inputPath.replace("~/", "/home/");
            } else if (inputPath.startsWith(".")) {
                resolvedPath = resolve(`/home${pathname}`, inputPath);
            }

            const validPaths = new Set([
                ...pathSuggestions,
                ...basePaths,
                ...paths
                    .filter(({ href }) => !href.startsWith("http"))
                    .map(({ href }) => href),
            ]);

            if (!validPaths.has(resolvedPath)) {
                return `No such file or directory: ${inputPath}`;
            }

            const applicationPath = resolvedPath.startsWith("/home")
                ? resolvedPath.replace("/home", "") || "/"
                : resolvedPath;

            router.push(applicationPath);
        },
    };

    const pathSuggestions = new Set([
        ...basePaths.map((path) => removeTrailingSlash(`/home${path}`)),
        ...paths
            .filter((path) => !path.href.startsWith("http"))
            .map((path) => removeTrailingSlash(`/home${path.href}`)),
    ]);

    const availableCommands = Object.keys(commands);

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
                const command = fullCommand.substring(1).trim();

                if (!command) {
                    resetCommand(true);
                    return;
                }

                let output = null;

                if (command.startsWith("!")) {
                    const [cmd, ...args] = command.split(" ");

                    if (cmd in commands) {
                        output = commands[cmd](...args);
                    } else {
                        output = `Command not found: ${command.replaceAll("!", "")}`;
                    }
                } else {
                    if (command in commands) {
                        output = commands[command]();
                    } else {
                        output = `Command not found: ${command.replaceAll("!", "")}`;
                    }
                }

                setCommandOutput(output ?? null);
            } else if (fullCommand.startsWith("/")) {
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

    useKeyboardShortcut(["Shift", ":"], () => openCommandBar(":"));
    useKeyboardShortcut(["/"], () => openCommandBar("/"));
    useKeyboardShortcut(["Shift", "?"], () => openCommandBar("?"));
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

    return (
        <CommandBarContext.Provider
            value={{
                availableCommands,
                pathSuggestions: Array.from(pathSuggestions),
                commandType,
                setCommandType,
                commandValue,
                setCommandValue,
                suggestions,
                setSuggestions,
                selectedSuggestionIndex,
                setSelectedSuggestionIndex,
                commandOutput,
                setCommandOutput,
                clearSearchHighlights,
                executeCommand,
                resetCommand,
            }}
        >
            {children}
        </CommandBarContext.Provider>
    );
}
