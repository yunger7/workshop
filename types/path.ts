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
