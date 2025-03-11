"use client";

import Highlighter from "react-highlight-words";
import React, { useState } from "react";
import { useCommandState } from "cmdk";
import { useTransitionRouter } from "next-transition-router";
import { Path, PathIconMap } from "@/types/path";
import { useViewsContext } from "@/contexts/views";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

function FilterState({ total }: { total: number }) {
    const filteredCount = useCommandState((state) => state.filtered.count || 0);

    return (
        <span className="absolute right-2 top-1/2 mr-1 -translate-y-1/2 text-xs text-muted-foreground">
            {filteredCount}/{total}
        </span>
    );
}

export function SearchDialog({ paths }: { paths: Path[] }) {
    const router = useTransitionRouter();
    const { isSearchDialogOpen, setIsSearchDialogOpen } = useViewsContext();

    const [value, setValue] = useState("");

    function openPath(path: string) {
        if (path.startsWith("http")) {
            window.open(path, "_blank");
        } else {
            router.push(path);
        }

        handleOpenChange(false);
    }

    function handleOpenChange(isOpen: boolean) {
        setIsSearchDialogOpen(isOpen);
        setValue("");
    }

    return (
        <CommandDialog
            open={isSearchDialogOpen}
            onOpenChange={handleOpenChange}
            label="Find"
        >
            <Command loop>
                <div className="relative border-b-2 border-nord-polar-1 pr-12 dark:border-nord-snow-3">
                    <CommandInput value={value} onValueChange={setValue} />
                    <FilterState total={paths.length} />
                </div>
                <CommandList>
                    <CommandEmpty>No results found</CommandEmpty>
                    {paths.map(({ type, alt, href }) => {
                        const IconComponent = PathIconMap[type];

                        return (
                            <CommandItem
                                key={alt}
                                onSelect={() => openPath(href)}
                            >
                                {IconComponent && (
                                    <IconComponent className="!size-4" />
                                )}
                                <Highlighter
                                    autoEscape
                                    searchWords={value?.trim()?.split(" ")}
                                    textToHighlight={alt}
                                    highlightClassName="bg-nord-frost-2"
                                />
                                <span className="ml-auto text-xs text-muted-foreground">
                                    <Highlighter
                                        autoEscape
                                        searchWords={value?.trim()?.split(" ")}
                                        textToHighlight={`/home/${type === "writing" ? type : `${type}s`}`}
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
