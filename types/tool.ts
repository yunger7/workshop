import { Icon } from "@/types/icon";

export type Tool = {
    name: string;
    description: string;
    slug: string;
    icon: Icon;
    unreleased?: boolean;
};
