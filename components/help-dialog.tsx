"use client";

import React from "react";
import {
    IconArrowUp,
    IconArrowRight,
    IconArrowLeft,
    IconArrowDown,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useViewsContext } from "@/contexts/views";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { KeyboardShortcut } from "@/components/ui/keyboard-shortcut";

type Command = {
    keys: string[];
    description: string;
    separator?: string;
};

type HelpSectionProps = React.ComponentPropsWithoutRef<"div"> & {
    title?: string;
    commands: Command[];
};

function HelpSection({ title, commands, ...props }: HelpSectionProps) {
    return (
        <div {...props}>
            {title && <p className="mb-2">{title}:</p>}
            <ul className={cn({ "pl-4": title })}>
                {commands.map(({ keys, description, separator }, index) => (
                    <li key={index} className="mb-2">
                        <KeyboardShortcut
                            withSeparator
                            keys={keys}
                            separator={separator}
                        />
                        : {description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function HelpDialog() {
    const { isHelpDialogOpen, setIsHelpDialogOpen } = useViewsContext();

    return (
        <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
            <DialogContent>
                <DialogTitle>Help</DialogTitle>
                <div className="grid grid-cols-2 place-content-between gap-8 p-8">
                    <HelpSection
                        title="Global shortcuts"
                        commands={[
                            { keys: ["space"], description: "Open menu" },
                            {
                                keys: ["mod", "h"],
                                description: "Toggle help dialog",
                            },
                            {
                                keys: ["mod", "k"],
                                description: "Toggle search dialog",
                            },
                            { keys: ["mod", "j"], description: "Toggle theme" },
                        ]}
                    />
                    <div className="ml-auto flex flex-col items-center gap-4">
                        <ul className="relative size-[100px]">
                            <li className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-2">
                                <IconArrowLeft className="size-4" />h
                            </li>
                            <li className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-2">
                                l
                                <IconArrowRight className="size-4" />
                            </li>
                            <li className="absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center gap-2">
                                <IconArrowUp className="size-4" />k
                            </li>
                            <li className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
                                j
                                <IconArrowDown className="size-4" />
                            </li>
                        </ul>
                        <p>(Arrow keys also work)</p>
                    </div>
                    <HelpSection
                        title="Vim commands"
                        commands={[
                            { keys: [":"], description: "Enter command mode" },
                            {
                                keys: [":!"],
                                description: "Execute shell command",
                            },
                            { keys: ["/"], description: "Search forward" },
                            { keys: ["?"], description: "Search backward" },
                            { keys: ["n"], description: "Move to next match" },
                            {
                                keys: ["N"],
                                description: "Move to previous match",
                            },
                            {
                                keys: ["gg"],
                                description: "Move to top of file",
                            },
                            {
                                keys: ["G"],
                                description: "Move to bottom of file",
                            },
                        ]}
                    />
                    <HelpSection
                        className="ml-auto"
                        title="Navigation"
                        commands={[
                            {
                                keys: ["esc", "backspace"],
                                separator: "/",
                                description: "Go back",
                            },
                            { keys: ["mod", "enter"], description: "Execute" },
                        ]}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
