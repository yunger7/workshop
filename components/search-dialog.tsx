"use client";

import Highlighter from "react-highlight-words";
import React, { useState } from "react";
import { useCommandState } from "cmdk";
import { useRouter } from "nextjs-toploader/app";
import {
    Icon,
    IconProps,
    IconPencil,
    IconTool,
    IconPackage,
} from "@tabler/icons-react";
import { useSearchContext, Path, PathType } from "@/contexts/search";
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
    const router = useRouter();
    const { isSearchDialogOpen, setIsSearchDialogOpen } = useSearchContext();

    const [value, setValue] = useState("");

    const IconMap: Record<
        PathType,
        React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
    > = {
        [PathType.Writing]: IconPencil,
        [PathType.Tool]: IconTool,
        [PathType.Project]: IconPackage,
    };

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
                    {paths.map(({ type, alt, href }) => {
                        const Icon = IconMap[type];

                        return (
                            <CommandItem
                                key={alt}
                                onSelect={() => openPath(href)}
                            >
                                <Icon className="!size-4" />
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
