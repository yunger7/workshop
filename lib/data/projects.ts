import { Project } from "@/types/project";

export function getProjects(): Project[] {
    return [
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
                "My workshop. A cozy place where I keep my tools, projects, writing and more",
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
}
