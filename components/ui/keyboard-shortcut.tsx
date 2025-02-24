"use client";

import React from "react";
import { cn, capitalize } from "@/lib/utils";
import { useOS } from "@/hooks/use-os";

type KeyProps = {
    children: React.ReactNode;
    className?: string;
};

const Key: React.FC<KeyProps> = ({ children, className = "" }) => (
    <kbd
        className={cn(
            "flex items-center justify-center rounded-sm border border-border bg-nord-snow-1 px-1.5 py-0.5 text-xs text-nord-polar-1",
            "dark:bg-nord-polar-2 dark:text-nord-snow-3",
            className,
        )}
    >
        {children}
    </kbd>
);

type KeyboardShortcutProps = {
    keys: string[];
    withSeparator?: boolean;
    separator?: string;
    className?: string;
};

export const KeyboardShortcut: React.FC<KeyboardShortcutProps> = ({
    keys,
    withSeparator = false,
    separator = "+",
    className = "",
}) => {
    const os = useOS();

    const getKeyContent = (key: string) => {
        switch (key.toLowerCase()) {
            case "mod":
                return os === "macos" ? "\u2318" : "Ctrl";
            case "command":
            case "cmd":
                return "\u2318";
            case "option":
            case "alt":
                return "\u2325";
            case "shift":
                return "\u21E7";
            case "ctrl":
                return "Ctrl";
            case "enter":
                return "\u23CE";
            case "backspace":
                return "\u232B";
            default:
                return key.length <= 2 ? key.toUpperCase() : capitalize(key);
        }
    };

    return (
        <div className={cn("inline-flex items-center space-x-1", className)}>
            {keys.map((key, index) => (
                <React.Fragment key={index}>
                    <Key>{getKeyContent(key)}</Key>
                    {withSeparator && index < keys.length - 1 && (
                        <span className="text-nord-polar-1 dark:text-nord-snow-3">
                            {separator}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};
