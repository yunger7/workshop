"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";
import {
    IconFolder,
    IconFolderOpen,
    IconSettings,
    IconUser,
    IconHome,
    IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/types/icon";
import { Path, PathIconMap, PathType } from "@/types/path";
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
};

function Node({
    isChild,
    icon: IconComponent,
    index,
    label,
    action,
    prevAction,
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
            )}
        >
            {renderIcon()}
            {label}
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
            <CollapsibleTrigger className="w-full">
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
    const router = useRouter();
    const [openedFolders, setOpenedFolders] = useState<string[]>([]);
    const { isExplorerOpen, setIsExplorerOpen } = useViewsContext();

    let index = 0;

    const { posts, projects, tools } = useMemo(() => {
        function formatPath(path: Path): ExplorerPath {
            return {
                label: path.alt,
                href: path.href,
                icon: PathIconMap[path.type],
            };
        }

        return {
            posts: paths
                .filter((path) => path.type === PathType.Writing)
                .map((path) => formatPath(path)),
            projects: paths
                .filter((path) => path.type === PathType.Project)
                .map((path) => formatPath(path)),
            tools: paths
                .filter((path) => path.type === PathType.Tool)
                .map((path) => formatPath(path)),
        };
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

    function renderNode(path: ExplorerPath) {
        return (
            <Node
                isChild
                key={path.href}
                label={path.label}
                index={index++}
                icon={path.icon}
                action={() => openPath(path.href)}
            />
        );
    }

    useEffect(() => {
        setOpenedFolders([]);
    }, [isExplorerOpen]);

    return (
        <ResizablePanelGroup direction="horizontal" className="min-h-screen">
            <ResizablePanel
                defaultSize={15}
                className={cn("p-4", { "hidden": !isExplorerOpen })}
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
                    <Node
                        label="Home"
                        index={index++}
                        action={() => openPath("/")}
                        icon={IconHome}
                    />
                    <div className="ml-4 flex flex-col">
                        <Folder
                            label="Writing"
                            open={openedFolders.includes("writing")}
                            index={index++}
                            onOpenChange={(open) =>
                                handleOpenChange(open, "writing")
                            }
                        >
                            {openedFolders.includes("writing") &&
                                posts.map((path) => renderNode(path))}
                        </Folder>
                        <Folder
                            label="Projects"
                            open={openedFolders.includes("projects")}
                            index={index++}
                            onOpenChange={(open) =>
                                handleOpenChange(open, "projects")
                            }
                        >
                            {openedFolders.includes("projects") &&
                                projects.map((path) => renderNode(path))}
                        </Folder>
                        <Folder
                            label="Tools"
                            open={openedFolders.includes("tools")}
                            index={index++}
                            onOpenChange={(open) =>
                                handleOpenChange(open, "tools")
                            }
                        >
                            {openedFolders.includes("tools") &&
                                tools.map((path) => renderNode(path))}
                        </Folder>
                        <Node
                            label="About"
                            index={index++}
                            action={() => openPath("/about")}
                            icon={IconUser}
                        />
                        <Node
                            label="Settings"
                            index={index++}
                            action={() => openPath("/settings")}
                            icon={IconSettings}
                        />
                    </div>
                </MenuList>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>{children}</ResizablePanel>
        </ResizablePanelGroup>
    );
}
