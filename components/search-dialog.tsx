"use client";

import React from "react";
import {
    Icon,
    IconProps,
    IconPencil,
    IconTool,
    IconPackage,
} from "@tabler/icons-react";
import { useSearchContext } from "@/contexts/search";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

type PathType = "writing" | "tool" | "project";

type Path = {
    type: PathType;
    slug: string;
};

const paths: Path[] = [
    { type: "writing", slug: "hello-world" },
    { type: "writing", slug: "thoughts-on-productivity" },
    { type: "writing", slug: "a-cozy-place-to-call-home" },
    { type: "writing", slug: "the-art-of-googling" },
    { type: "writing", slug: "why-digital-craftsman" },
    { type: "tool", slug: "lorem-ipsum" },
    { type: "tool", slug: "strong-password" },
    { type: "tool", slug: "uuid" },
    { type: "tool", slug: "color-converter" },
    { type: "tool", slug: "base64" },
    { type: "project", slug: "enem.dev" },
    { type: "project", slug: "yunger.dev" },
    { type: "project", slug: "portfolio" },
    { type: "project", slug: "zicott" },
];

export function SearchDialog() {
    const { isSearchDialogOpen, setIsSearchDialogOpen } = useSearchContext();

    const IconMap: Record<
        PathType,
        React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
    > = {
        writing: IconPencil,
        tool: IconTool,
        project: IconPackage,
    };

    return (
        <CommandDialog
            title="Find"
            open={isSearchDialogOpen}
            onOpenChange={setIsSearchDialogOpen}
        >
            <Command>
                <CommandInput placeholder="Find" />
                <CommandList>
                    <CommandEmpty>No results found</CommandEmpty>
                    {paths.map(({ type, slug }) => {
                        const Icon = IconMap[type];

                        return (
                            <CommandItem key={slug}>
                                <Icon className="!size-4" />
                                {slug}
                                <span className="ml-auto text-xs text-muted-foreground">
                                    /home/{type}
                                </span>
                            </CommandItem>
                        );
                    })}
                </CommandList>
            </Command>
        </CommandDialog>
    );
}
