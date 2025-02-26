import { IconPencil, IconTool, IconPackage } from "@tabler/icons-react";
import { Icon } from "@/types/icon";

export enum PathType {
    Writing = "writing",
    Tool = "tool",
    Project = "project",
}

export type Path = {
    type: PathType;
    alt: string;
    href: string;
};

export const PathIconMap: Record<PathType, Icon> = {
    [PathType.Writing]: IconPencil,
    [PathType.Tool]: IconTool,
    [PathType.Project]: IconPackage,
};
