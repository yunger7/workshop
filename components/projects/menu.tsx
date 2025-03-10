"use client";

import React, { Fragment } from "react";
import { motion } from "framer-motion";
import { IconBrandGithub, IconBrandNpm, IconWorld } from "@tabler/icons-react";
import { Icon } from "@/types/icon";
import { Project, Link } from "@/types/project";
import { Button } from "@/components/ui/button";
import { useSettingsContext } from "@/contexts/settings";
import { MenuList, MenuItem } from "@/components/menu";
import { Stars } from "@/components/projects/stars";

type MenuProps = {
    projects: Project[];
};

export function Menu({ projects }: MenuProps) {
    const { enableAnimations } = useSettingsContext();

    const LinkIconMap: Record<Link["type"], Icon> = {
        github: IconBrandGithub,
        npm: IconBrandNpm,
        website: IconWorld,
    };

    const LinkLabelMap: Record<Link["type"], string> = {
        github: "GitHub",
        npm: "NPM",
        website: "Website",
    };

    return (
        <MenuList className="flex flex-col gap-6">
            {projects.map((project, index) => {
                const primaryLink =
                    project.links.find((link) => link.isPrimary) ??
                    project.links[0];

                return (
                    <Fragment key={project.title}>
                        <MenuItem
                            disableClick
                            index={index}
                            action={() =>
                                window.open(primaryLink.url, "_blank")
                            }
                        >
                            <Button variant="card" className="h-fit p-5">
                                <div className="mb-1.5 flex w-full items-center justify-between gap-2">
                                    <h2 className="text-md -mt-0.5 inline-flex text-left">
                                        <a
                                            href={primaryLink.url}
                                            target="_blank"
                                            className="hover:underline"
                                        >
                                            {project.title}
                                        </a>
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        {!!project.stars && (
                                            <>
                                                <Stars count={project.stars} />
                                                <span className="text-muted-foreground">
                                                    &#x2022;
                                                </span>
                                            </>
                                        )}
                                        {project.links.map((link) => {
                                            const IconComponent =
                                                LinkIconMap[link.type];
                                            const label =
                                                LinkLabelMap[link.type];

                                            return (
                                                <motion.a
                                                    key={link.url}
                                                    whileHover={
                                                        enableAnimations
                                                            ? { y: -2 }
                                                            : undefined
                                                    }
                                                    transition={
                                                        enableAnimations
                                                            ? {
                                                                  type: "spring",
                                                                  stiffness: 300,
                                                              }
                                                            : undefined
                                                    }
                                                    href={link.url}
                                                    target="_blank"
                                                >
                                                    <span className="sr-only">
                                                        {label}
                                                    </span>
                                                    <IconComponent className="size-4" />
                                                </motion.a>
                                            );
                                        })}
                                    </div>
                                </div>
                                <p className="max-w-prose text-pretty text-left text-muted-foreground">
                                    {project.description}
                                </p>
                            </Button>
                        </MenuItem>
                    </Fragment>
                );
            })}
        </MenuList>
    );
}
