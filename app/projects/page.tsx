import { Project } from "@/types/project";
import { Layout } from "@/components/layout";
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
        <Layout title="Projects">
            <Menu projects={projects} />
        </Layout>
    );
}
