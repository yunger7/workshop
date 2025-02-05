import Link from "next/link";
import { IconRss, IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { Menu } from "@/components/writing/menu";

async function getPosts() {
    return [
        {
            title: "Excepteur quis cillum est.",
            date: "Feb 02, 2025",
        },
        {
            title: "Tempor voluptate anim duis id ut proident.",
            date: "Jan 08, 2025",
        },
        {
            title: "Dolore cupidatat nulla nulla officia quis id.",
            date: "Dec 08, 2024",
        },
        {
            title: "Fugiat cupidatat ea reprehenderit.",
            date: "Oct 02, 2024",
        },
        {
            title: "Ipsum proident labore sit.",
            date: "Aug 16, 2022",
        },
        {
            title: "Hello World!",
            date: "Aug 10, 2022",
        },
    ];
}

export default async function WritingPage() {
    const posts = await getPosts();

    return (
        <main className="mx-auto my-16 max-w-screen-md px-6">
            <div className="mb-4 flex items-center justify-between">
                <Link href="/">
                    <div className="group relative flex items-center">
                        <IconArrowLeft className="absolute left-0 top-1/2 -ml-7 size-5 -translate-y-1/2 opacity-40 transition-transform duration-200 group-hover:-translate-x-1" />
                        <h1 className="text-2xl font-bold group-hover:cursor-pointer">
                            Writing
                        </h1>
                    </div>
                </Link>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="outline">
                            <span className="sr-only">RSS Feed</span>
                            <IconRss className="size-6" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>RSS Feed</p>
                    </TooltipContent>
                </Tooltip>
            </div>
            <Menu posts={posts} />
        </main>
    );
}
