"use client";

import React, { useState, useEffect, forwardRef } from "react";
import { cn } from "@/lib/utils";

type TerminalInputProps = React.ComponentPropsWithoutRef<"input">;

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
    ({ className, ...props }, ref) => {
        const [cursorPosition, setCursorPosition] = useState(0);
        const [isCursorVisible, setIsCursorVisible] = useState(true);
        const [commandValue, setCommandValue] = useState("");

        useEffect(() => {
            const interval = setInterval(() => {
                setIsCursorVisible((prev) => !prev);
            }, 530);

            return () => clearInterval(interval);
        }, []);

        useEffect(() => {
            if (ref && typeof ref !== "function" && ref.current) {
                ref.current.setSelectionRange(cursorPosition, cursorPosition);
            }
        }, [cursorPosition, commandValue, ref]);

        const moveCursorToPreviousWord = (cursor: number, value: string) => {
            let pos = cursor;

            while (pos > 0 && value[pos - 1] === " ") {
                pos--;
            }

            while (pos > 0 && value[pos - 1] !== " ") {
                pos--;
            }
            return pos;
        };

        const moveCursorToNextWord = (cursor: number, value: string) => {
            let pos = cursor;

            while (pos < value.length && value[pos] !== " ") {
                pos++;
            }

            while (pos < value.length && value[pos] === " ") {
                pos++;
            }

            return pos;
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            const { key, ctrlKey } = e;
            const cursorMove = (newPosition: number) =>
                setCursorPosition(
                    Math.max(0, Math.min(newPosition, commandValue.length)),
                );

            const actions: Record<string, () => void> = {
                ArrowLeft: () => {
                    if (ctrlKey) {
                        setCursorPosition(
                            moveCursorToPreviousWord(
                                cursorPosition,
                                commandValue,
                            ),
                        );
                    } else {
                        cursorMove(cursorPosition - 1);
                    }
                },
                ArrowRight: () => {
                    if (ctrlKey) {
                        setCursorPosition(
                            moveCursorToNextWord(cursorPosition, commandValue),
                        );
                    } else {
                        cursorMove(cursorPosition + 1);
                    }
                },
                Backspace: () => {
                    if (cursorPosition > 0) {
                        const newPos = ctrlKey
                            ? moveCursorToPreviousWord(
                                  cursorPosition,
                                  commandValue,
                              )
                            : cursorPosition - 1;
                        setCommandValue(
                            (prev) =>
                                prev.slice(0, newPos) +
                                prev.slice(cursorPosition),
                        );
                        setCursorPosition(newPos);
                    }
                },
                Delete: () => {
                    if (cursorPosition < commandValue.length) {
                        const newPos = ctrlKey
                            ? moveCursorToNextWord(cursorPosition, commandValue)
                            : cursorPosition + 1;
                        setCommandValue(
                            (prev) =>
                                prev.slice(0, cursorPosition) +
                                prev.slice(newPos),
                        );
                    }
                },
                Home: () => {
                    setCursorPosition(0);
                },
                End: () => {
                    setCursorPosition(commandValue.length);
                },
                " ": () => {
                    setCommandValue(
                        (prev) =>
                            prev.slice(0, cursorPosition) +
                            " " +
                            prev.slice(cursorPosition),
                    );
                    setCursorPosition(cursorPosition + 1);
                },
            };

            if (actions[key]) {
                e.preventDefault();
                actions[key]();
            }
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            const newCursorPosition =
                e.target.selectionStart ?? newValue.length;
            setCommandValue(newValue);
            setCursorPosition(newCursorPosition);
        };

        return (
            <div className="relative flex-1 select-none">
                <input
                    ref={ref}
                    type="text"
                    value={commandValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "w-full select-none border-none bg-transparent caret-transparent outline-none selection:bg-transparent",
                        className,
                    )}
                    autoComplete="off"
                    spellCheck="false"
                    {...props}
                />
                <div
                    className="pointer-events-none absolute bottom-0 left-0 top-0"
                    style={{ paddingLeft: `${cursorPosition * 0.6}em` }}
                >
                    <span
                        className={cn(
                            "-mb-1 inline-block h-[1.2em] w-[0.6em] bg-nord-snow-1 text-nord-polar-1",
                            { hidden: !isCursorVisible },
                        )}
                    >
                        {commandValue[cursorPosition] || " "}
                    </span>
                </div>
            </div>
        );
    },
);

TerminalInput.displayName = "TerminalInput";
