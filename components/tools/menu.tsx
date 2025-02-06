"use client";

import slugify from "slugify";
import { Fragment } from "react";
import { useRouter } from "nextjs-toploader/app";
import {
    IconTypography,
    IconKey,
    IconHash,
    IconPhotoScan,
    IconPalette,
    IconTransform,
} from "@tabler/icons-react";
import { Tool } from "@/types/tool";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MenuList, MenuItem } from "@/components/menu";

const tools: Tool[] = [
    {
        name: "Lorem Ipsum",
        description: "Generate dummy text to use as a placeholder",
        icon: IconTypography,
    },
    {
        name: "Strong Password",
        description: "Create a secure, randomly generated password",
        icon: IconKey,
    },
    {
        name: "UUID",
        description: "Generate a unique identifier (v4)",
        icon: IconHash,
    },
    {
        name: "Color converter",
        description: "Convert colors between different formats",
        icon: IconPalette,
    },
    {
        name: "Base64",
        description: "Encode and decode data in Base64 format",
        icon: IconTransform,
    },
    {
        name: "SVG preview",
        description: "Preview SVG files",
        icon: IconPhotoScan,
        unreleased: true,
    },
];

export function Menu() {
    const router = useRouter();

    function openTool(tool: Tool) {
        if (tool.unreleased) return;

        const slug = slugify(tool.name, { lower: true });

        router.push(`/tools/${slug}`);
    }

    return (
        <MenuList className="flex flex-col">
            {tools.map((tool, index) => {
                const Icon = tool.icon;

                return (
                    <Fragment key={tool.name}>
                        <MenuItem
                            key={tool.name}
                            index={index}
                            className="justify-between py-2"
                            action={() => openTool(tool)}
                        >
                            <div className="flex gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="sr-only">{tool.name}</span>
                                    <Icon className="size-6" />
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
                        </MenuItem>
                        {index !== tools.length - 1 && (
                            <Separator className="my-2" />
                        )}
                    </Fragment>
                );
            })}
        </MenuList>
    );
}
