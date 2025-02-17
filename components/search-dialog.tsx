"use client";

import Highlighter from "react-highlight-words";
import React, { useState } from "react";
import { useCommandState } from "cmdk";
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

function FilterState({ total }: { total: number }) {
    const filteredCount = useCommandState((state) => state.filtered.count || 0);

    return (
        <span className="absolute right-2 top-1/2 mr-1 -translate-y-1/2 text-xs text-muted-foreground">
            {filteredCount}/{total}
        </span>
    );
}

export function SearchDialog() {
    const { isSearchDialogOpen, setIsSearchDialogOpen } = useSearchContext();

    const [value, setValue] = useState("");

    const IconMap: Record<
        PathType,
        React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
    > = {
        writing: IconPencil,
        tool: IconTool,
        project: IconPackage,
    };

    function handleOpenChange(isOpen: boolean) {
        setIsSearchDialogOpen(isOpen);
        setValue("");
    }

    return (
        <CommandDialog
            title="Find"
            open={isSearchDialogOpen}
            onOpenChange={handleOpenChange}
        >
            <Command loop>
                <div className="relative border-b-2 border-nord-polar-1 pr-12 dark:border-nord-snow-3">
                    <CommandInput
                        placeholder="Find"
                        value={value}
                        onValueChange={setValue}
                    />
                    <FilterState total={paths.length} />
                </div>
                <CommandList>
                    <CommandEmpty>No results found</CommandEmpty>
                    {paths.map(({ type, slug }) => {
                        const Icon = IconMap[type];

                        return (
                            <CommandItem key={slug}>
                                <Icon className="!size-4" />
                                <Highlighter
                                    autoEscape
                                    searchWords={value?.trim()?.split(" ")}
                                    textToHighlight={slug}
                                    highlightClassName="bg-nord-frost-2"
                                />
                                <span className="ml-auto text-xs text-muted-foreground">
                                    <Highlighter
                                        autoEscape
                                        searchWords={value?.trim()?.split(" ")}
                                        textToHighlight={`/home/${type}`}
                                        highlightClassName="bg-primary"
                                    />
                                </span>
                            </CommandItem>
                        );
                    })}
                </CommandList>
            </Command>
        </CommandDialog>
    );
}
