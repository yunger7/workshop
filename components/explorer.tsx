"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useTransitionRouter } from "next-transition-router";
import { IconFolder, IconFolderOpen, IconX } from "@tabler/icons-react";
import { capitalize, cn } from "@/lib/utils";
import { Icon } from "@/types/icon";
import { Path, PathIconMap, PathType, getBasePath } from "@/types/path";
import { useViewsContext } from "@/contexts/views";
import { MenuList, MenuItem } from "@/components/menu";
import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

type ExplorerProps = {
    children: React.ReactNode;
    paths: Path[];
};

type NodeProps = {
    label: string;
    index: number;
    prevAction?: () => void;
    action?: () => void;
    icon?: Icon;
    isChild?: boolean;
    className?: string;
};

function Node({
    isChild,
    icon: IconComponent,
    index,
    label,
    action,
    prevAction,
    className,
}: NodeProps) {
    function renderIcon() {
        if (IconComponent) {
            return <IconComponent className="size-4 shrink-0" />;
        }

        if (!isChild) {
            return <IconFolderOpen className="size-4 shrink-0" />;
        }

        return null;
    }

    return (
        <MenuItem
            prevAction={prevAction}
            action={action}
            index={index}
            className={cn(
                "flex min-h-7 w-full items-center justify-start gap-2 text-nowrap",
                {
                    "ml-4": isChild,
                },
                className,
            )}
        >
            {renderIcon()}
            <span>{label}</span>
        </MenuItem>
    );
}

type FolderProps = {
    label: string;
    index: number;
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
    children?: React.ReactNode;
};

function Folder({ label, index, open, onOpenChange, children }: FolderProps) {
    return (
        <Collapsible open={open} onOpenChange={onOpenChange}>
            <CollapsibleTrigger tabIndex={-1} className="w-full">
                <Node
                    label={label}
                    index={index}
                    icon={open ? IconFolderOpen : IconFolder}
                    action={() => onOpenChange(!open)}
                    prevAction={() => onOpenChange(false)}
                />
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
}

type ExplorerPath = {
    label: string;
    href: string;
    icon: Icon;
};

export function Explorer({ paths, children }: ExplorerProps) {
    const router = useTransitionRouter();
    const [openedFolders, setOpenedFolders] = useState<string[]>([]);
    const { isExplorerOpen, setIsExplorerOpen } = useViewsContext();

    let index = 0;

    const nodes = useMemo(() => {
        function formatChildPath(path: Path): ExplorerPath {
            return {
                label: path.alt,
                href: path.href,
                icon: PathIconMap[path.type],
            };
        }

        return Object.values(PathType).map((pathType) => {
            return {
                label: capitalize(pathType),
                href: getBasePath(pathType),
                icon: PathIconMap[pathType],
                children: paths
                    .filter((path) => path.type === pathType)
                    .map((path) => formatChildPath(path)),
            };
        });
    }, [paths]);

    function handleOpenChange(isOpen: boolean, name: string) {
        if (isOpen) {
            setOpenedFolders((prev) => [...prev, name]);
        } else {
            setOpenedFolders((prev) =>
                prev.filter((folder) => folder !== name),
            );
        }
    }

    function openPath(path?: string) {
        if (!path) return;

        if (path.startsWith("http")) {
            window.open(path, "_blank");
        } else {
            router.push(path);
        }

        setIsExplorerOpen(false);
    }

    useEffect(() => {
        setOpenedFolders([]);
    }, [isExplorerOpen]);

    return (
        <ResizablePanelGroup direction="horizontal" className="min-h-screen">
            <ResizablePanel
                defaultSize={15}
                className={cn("bg-background p-4", { hidden: !isExplorerOpen })}
            >
                <div className="flex items-center justify-between gap-2">
                    <span>Explorer</span>
                    <Button
                        className="aspect-square size-6"
                        variant="outline"
                        size="icon"
                        onClick={() => setIsExplorerOpen(false)}
                    >
                        <span className="sr-only">Close explorer</span>
                        <IconX className="!size-3.5" />
                    </Button>
                </div>
                <MenuList isExplorer className="flex flex-col p-2">
                    <div className="ml-4 flex flex-col">
                        {nodes.map((node) => {
                            const hasChildren =
                                Array.isArray(node.children) &&
                                node.children.length > 0;

                            if (hasChildren) {
                                return (
                                    <Folder
                                        key={node.href}
                                        label={node.label}
                                        open={openedFolders.includes(node.href)}
                                        index={index++}
                                        onOpenChange={(open) =>
                                            handleOpenChange(open, node.href)
                                        }
                                    >
                                        {openedFolders.includes(node.href) &&
                                            node.children.map((child) => (
                                                <Node
                                                    isChild
                                                    key={child.href}
                                                    label={child.label}
                                                    index={index++}
                                                    icon={child.icon}
                                                    action={() =>
                                                        openPath(child.href)
                                                    }
                                                />
                                            ))}
                                    </Folder>
                                );
                            }

                            return (
                                <Node
                                    key={node.href}
                                    label={node.label}
                                    index={index++}
                                    action={() => openPath(node.href)}
                                    icon={node.icon}
                                    className={cn({
                                        "-ml-4": node.label === "Home",
                                    })}
                                />
                            );
                        })}
                    </div>
                </MenuList>
            </ResizablePanel>
            <ResizableHandle
                tabIndex={-1}
                className={cn({ hidden: !isExplorerOpen })}
            />
            <ResizablePanel>{children}</ResizablePanel>
        </ResizablePanelGroup>
    );
}
