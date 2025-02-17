import slugify from "slugify";
import {
    IconTypography,
    IconKey,
    IconHash,
    IconPhotoScan,
    IconPalette,
    IconTransform,
} from "@tabler/icons-react";
import { Tool } from "@/types/tool";

export function getTools(): Tool[] {
    function getSlug(name: string) {
        return slugify(name, { lower: true });
    }

    const tools: Array<Omit<Tool, "slug">> = [
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

    return tools.map((tool) => ({
        ...tool,
        slug: getSlug(tool.name),
    }));
}
