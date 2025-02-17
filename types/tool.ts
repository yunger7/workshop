import { Icon, IconProps } from "@tabler/icons-react";

export type Tool = {
    name: string;
    description: string;
    slug: string;
    icon: React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<Icon>
    >;
    unreleased?: boolean;
};
