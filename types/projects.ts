export type Link = {
    type: "github" | "npm" | "website";
    url: string;
    isPrimary?: boolean;
};

export type Project = {
    title: string;
    description: string;
    links: Link[];
    stars?: number;
};
