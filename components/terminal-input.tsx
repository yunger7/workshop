"use client";

import React, { useState, useEffect, forwardRef } from "react";
import { cn } from "@/lib/utils";

type TerminalInputProps = React.ComponentPropsWithoutRef<"input">;

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
    ({ className, value, onChange, onKeyDown, ...props }, ref) => {
        const [cursorPosition, setCursorPosition] = useState(0);
        const [isCursorVisible, setIsCursorVisible] = useState(true);
        const [internalValue, setInternalValue] = useState("");

        useEffect(() => {
            setInternalValue(String(value) ?? "");
            setCursorPosition(String(value).length);
        }, [value]);

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
        }, [cursorPosition, internalValue, ref]);

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
                    Math.max(0, Math.min(newPosition, internalValue.length)),
                );

            const actions: Record<string, () => void> = {
                "ArrowLeft": () => {
                    if (ctrlKey) {
                        setCursorPosition(
                            moveCursorToPreviousWord(
                                cursorPosition,
                                internalValue,
                            ),
                        );
                    } else {
                        cursorMove(cursorPosition - 1);
                    }
                },
                "ArrowRight": () => {
                    if (ctrlKey) {
                        setCursorPosition(
                            moveCursorToNextWord(cursorPosition, internalValue),
                        );
                    } else {
                        cursorMove(cursorPosition + 1);
                    }
                },
                "Backspace": () => {
                    if (cursorPosition > 0) {
                        const newPos = ctrlKey
                            ? moveCursorToPreviousWord(
                                  cursorPosition,
                                  internalValue,
                              )
                            : cursorPosition - 1;

                        const newValue =
                            internalValue.slice(0, newPos) +
                            internalValue.slice(cursorPosition);

                        setInternalValue(newValue);
                        setCursorPosition(newPos);

                        if (onChange) {
                            onChange({
                                target: { value: newValue },
                            } as React.ChangeEvent<HTMLInputElement>);
                        }
                    }
                },
                "Delete": () => {
                    if (cursorPosition < internalValue.length) {
                        const newPos = ctrlKey
                            ? moveCursorToNextWord(
                                  cursorPosition,
                                  internalValue,
                              )
                            : cursorPosition + 1;

                        const newValue =
                            internalValue.slice(0, cursorPosition) +
                            internalValue.slice(newPos);

                        setInternalValue(newValue);

                        if (onChange) {
                            onChange({
                                target: { value: newValue },
                            } as React.ChangeEvent<HTMLInputElement>);
                        }
                    }
                },
                "Home": () => {
                    setCursorPosition(0);
                },
                "End": () => {
                    setCursorPosition(internalValue.length);
                },
                " ": () => {
                    const newValue =
                        internalValue.slice(0, cursorPosition) +
                        " " +
                        internalValue.slice(cursorPosition);

                    setInternalValue(newValue);
                    setCursorPosition(cursorPosition + 1);

                    if (onChange) {
                        onChange({
                            target: { value: newValue },
                        } as React.ChangeEvent<HTMLInputElement>);
                    }
                },
            };

            if (onKeyDown) {
                onKeyDown(e);
            }

            if (actions[key]) {
                e.preventDefault();
                actions[key]();
            }
        };

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = event.target.value;
            const newCursorPosition =
                event.target.selectionStart ?? newValue.length;
            setInternalValue(newValue);
            setCursorPosition(newCursorPosition);

            if (onChange) {
                onChange(event);
            }
        };

        return (
            <div className="relative flex-1 select-none">
                <input
                    ref={ref}
                    type="text"
                    value={internalValue}
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
                            "-mb-1 inline-block h-[1.2em] w-[0.6em] bg-nord-polar-3 text-background dark:bg-nord-snow-1 dark:text-nord-polar-1",
                            { hidden: !isCursorVisible },
                        )}
                    >
                        {internalValue[cursorPosition] || " "}
                    </span>
                </div>
            </div>
        );
    },
);

TerminalInput.displayName = "TerminalInput";
