"use client";

import React, { useState } from "react";
import {
    Icon,
    IconProps,
    IconSettings,
    IconSearch,
    IconX,
    IconTool,
    IconPackage,
    IconPencil,
    IconUser,
    IconChevronRight,
} from "@tabler/icons-react";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

type Option = {
    name: string;
    icon: React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<Icon>
    >;
    shortcut: string;
};

const options: Option[] = [
    { name: "Find", icon: IconSearch, shortcut: "f" },
    { name: "Writing", icon: IconPencil, shortcut: "w" },
    { name: "Projects", icon: IconPackage, shortcut: "p" },
    { name: "Tools", icon: IconTool, shortcut: "t" },
    { name: "About", icon: IconUser, shortcut: "a" },
    { name: "Settings", icon: IconSettings, shortcut: "s" },
    { name: "Quit", icon: IconX, shortcut: "q" },
];

export function Menu() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    function next() {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % options.length);
    }

    function prev() {
        setSelectedIndex(
            (prevIndex) => (prevIndex + options.length - 1) % options.length,
        );
    }

    useKeyboardShortcut(["j"], next);
    useKeyboardShortcut(["ArrowDown"], next);
    useKeyboardShortcut(["k"], prev);
    useKeyboardShortcut(["ArrowUp"], prev);

    return (
        <div className="flex w-full max-w-lg flex-col items-center">
            {options.map(({ name, icon: Icon, shortcut }, index) => (
                <button
                    key={name}
                    className="relative flex w-full cursor-pointer items-center justify-between px-2 py-2.5"
                    onMouseEnter={() => setSelectedIndex(index)}
                >
                    {selectedIndex === index && (
                        <span className="absolute left-0 -ml-2 -translate-x-full animate-bounce-right">
                            <IconChevronRight className="size-4" />
                        </span>
                    )}
                    <span className="flex w-full items-center gap-2">
                        <Icon className="size-4" />
                        {name}
                    </span>
                    <span className="ml-4">{shortcut}</span>
                </button>
            ))}
        </div>
    );
}
