import {
    IconHome,
    IconPencil,
    IconTool,
    IconPackage,
    IconUser,
    IconSettings,
} from "@tabler/icons-react";
import { Icon } from "@/types/icon";

export enum PathType {
    Home = "home",
    Writing = "writing",
    Projects = "projects",
    Tools = "tools",
    About = "about",
    Settings = "settings",
}

export const basePaths = Object.values(PathType).map((path) => {
    if (path === PathType.Home) {
        return "/";
    }

    return `/${path}`;
});

export type Path = {
    type: PathType;
    alt: string;
    href: string;
};

export const PathIconMap: Record<PathType, Icon> = {
    [PathType.Home]: IconHome,
    [PathType.Writing]: IconPencil,
    [PathType.Projects]: IconPackage,
    [PathType.Tools]: IconTool,
    [PathType.About]: IconUser,
    [PathType.Settings]: IconSettings,
};
