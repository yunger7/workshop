import type { Metadata } from "next";
import { getProjects } from "@/lib/data/projects";
import { Layout } from "@/components/layout";
import { Menu } from "@/components/projects/menu";

export const metadata: Metadata = {
    title: "Projects",
};

async function getProjectsData() {
    const projects = getProjects();

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
    const projects = await getProjectsData();

    return (
        <Layout title="Projects">
            <Menu projects={projects} />
        </Layout>
    );
}
