"use client";

import React from "react";
import { useRouter } from "nextjs-toploader/app";
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
} from "@tabler/icons-react";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useSearchContext } from "@/contexts/search";
import { MenuList, MenuItem } from "@/components/menu";

type Option = {
    name: string;
    icon: React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<Icon>
    >;
    shortcut: string;
    action: () => void;
};

export function Menu() {
    const router = useRouter();
    const { setIsSearchDialogOpen } = useSearchContext();

    const actions = {
        find: () => setIsSearchDialogOpen(true),
        writing: () => router.push("/writing"),
        projects: () => router.push("/projects"),
        tools: () => router.push("/tools"),
        about: () => router.push("/about"),
        settings: () => router.push("/settings"),
        quit: () => window.close(),
    };

    const options: Option[] = [
        { name: "Find", icon: IconSearch, shortcut: "f", action: actions.find },
        {
            name: "Writing",
            icon: IconPencil,
            shortcut: "w",
            action: actions.writing,
        },
        {
            name: "Projects",
            icon: IconPackage,
            shortcut: "p",
            action: actions.projects,
        },
        { name: "Tools", icon: IconTool, shortcut: "t", action: actions.tools },
        { name: "About", icon: IconUser, shortcut: "a", action: actions.about },
        {
            name: "Settings",
            icon: IconSettings,
            shortcut: "s",
            action: actions.settings,
        },
        { name: "Quit", icon: IconX, shortcut: "q", action: actions.quit },
    ];

    useKeyboardShortcut(["f"], () => actions.find());
    useKeyboardShortcut(["w"], () => actions.writing());
    useKeyboardShortcut(["p"], () => actions.projects());
    useKeyboardShortcut(["t"], () => actions.tools());
    useKeyboardShortcut(["a"], () => actions.about());
    useKeyboardShortcut(["s"], () => actions.settings());
    useKeyboardShortcut(["q"], () => actions.quit());

    return (
        <MenuList className="flex w-full max-w-lg flex-col items-center">
            {options.map(({ name, icon: Icon, shortcut }, index) => (
                <MenuItem
                    key={name}
                    index={index}
                    action={() => options[index].action()}
                    className="py-2.5"
                >
                    <span className="flex w-full items-center gap-2">
                        <Icon className="size-4" />
                        {name}
                    </span>
                    <span className="ml-4">{shortcut}</span>
                </MenuItem>
            ))}
        </MenuList>
    );
}
