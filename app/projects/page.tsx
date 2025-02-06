import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { Project } from "@/types/projects";
import { Menu } from "@/components/projects/menu";

async function getProjects() {
    const projects: Project[] = [
        {
            title: "enem.dev",
            description:
                "A public and open-source API for Brazil's National High School Exam",
            links: [
                {
                    type: "github",
                    url: "https://github.com/yunger7/enem-api",
                },
                {
                    type: "website",
                    url: "https://enem.dev",
                    isPrimary: true,
                },
            ],
        },
        {
            title: "yunger.dev",
            description:
                "My workshop. A cozy place where I keep my tools, projects, notes and more",
            links: [
                {
                    type: "github",
                    url: "https://github.com/yunger7/workshop",
                    isPrimary: true,
                },
                {
                    type: "website",
                    url: "https://yunger.dev",
                },
            ],
        },
        {
            title: "portfolio",
            description:
                "My online business card. A place to showcase projects and tell a bit about myself.",
            links: [
                {
                    type: "github",
                    url: "https://github.com/yunger7/portfolio",
                },
                {
                    type: "website",
                    url: "https://luisgalete.com.br",
                    isPrimary: true,
                },
            ],
        },
        {
            title: "zicott",
            description: "A CLI tool to easily download YouTube music",
            links: [
                {
                    type: "github",
                    url: "https://github.com/yunger7/zicott",
                    isPrimary: true,
                },
                {
                    type: "npm",
                    url: "https://www.npmjs.com/package/zicott",
                },
            ],
        },
    ];

    const projectsWithStars = await Promise.all(
        projects.map(async (project) => {
            const hasGithubLink = project.links.find(
                (link) => link.type === "github",
            );

            if (!hasGithubLink) return project;

            const url = new URL(hasGithubLink.url);
            const repo = url.pathname.split("/").pop();
            const user = url.pathname.split("/")[1];

            const response = await fetch(
                `https://api.github.com/repos/${user}/${repo}`,
                {
                    next: {
                        revalidate: 60 * 10, // 10 minutes
                    },
                },
            );

            const data = await response.json();

            return {
                ...project,
                stars: data.stargazers_count,
            };
        }),
    );

    return projectsWithStars;
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <main className="mx-auto my-16 max-w-screen-md px-6">
            <div className="mb-4">
                <Link href="/">
                    <div className="group relative flex items-center">
                        <IconArrowLeft className="absolute left-0 top-1/2 -ml-7 size-5 -translate-y-1/2 opacity-40 transition-transform duration-200 group-hover:-translate-x-1" />
                        <h1 className="text-2xl font-bold group-hover:cursor-pointer">
                            Projects
                        </h1>
                    </div>
                </Link>
            </div>
            <Menu projects={projects} />
        </main>
    );
}
