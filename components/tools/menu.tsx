"use client";

import slugify from "slugify";
import { Fragment } from "react";
import { useTransitionRouter } from "next-transition-router";
import { getTools } from "@/lib/data/tools";
import { Tool } from "@/types/tool";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MenuList, MenuItem } from "@/components/menu";

export function Menu() {
    const tools = getTools();
    const router = useTransitionRouter();

    function openTool(tool: Tool) {
        if (tool.unreleased) return;

        const slug = slugify(tool.name, { lower: true });

        router.push(`/tools/${slug}`);
    }

    return (
        <MenuList className="flex flex-col gap-6">
            {tools.map((tool, index) => {
                const Icon = tool.icon;

                return (
                    <Fragment key={tool.name}>
                        <MenuItem
                            key={tool.name}
                            index={index}
                            action={() => openTool(tool)}
                        >
                            <Button
                                variant="card"
                                className="flex h-fit justify-between p-3"
                            >
                                <div className="flex gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="sr-only">
                                            {tool.name}
                                        </span>
                                        <Icon className="!size-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-md text-left">
                                            {tool.name}
                                        </h2>
                                        <p className="text-pretty text-left text-muted-foreground">
                                            {tool.description}
                                        </p>
                                    </div>
                                </div>
                                {!!tool.unreleased && (
                                    <Badge variant="secondary">Soon</Badge>
                                )}
                            </Button>
                        </MenuItem>
                    </Fragment>
                );
            })}
        </MenuList>
    );
}
