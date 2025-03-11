"use client";

import { useRouter } from "nextjs-toploader/app";
import { MenuList, MenuItem } from "@/components/menu";
import { Button } from "@/components/ui/button";

type Post = { title: string; date: string; slug: string };

type MenuProps = {
    posts: Post[];
};

export function Menu({ posts }: MenuProps) {
    const router = useRouter();

    return (
        <MenuList className="flex flex-col gap-6 sm:gap-0">
            {posts.map((post, index) => (
                <MenuItem
                    key={post.title}
                    index={index}
                    action={() => router.push(`/writing/${post.slug}`)}
                >
                    <Button
                        variant="card"
                        className="flex h-fit flex-col items-start gap-3 p-3 font-normal sm:flex-row sm:items-center sm:justify-between sm:border-none sm:bg-transparent sm:p-0 sm:py-2.5"
                    >
                        <h2 className="text-md text-wrap text-left">
                            {post.title}
                        </h2>
                        <div className="whitespace-nowrap text-muted-foreground sm:text-foreground">
                            {post.date}
                        </div>
                    </Button>
                </MenuItem>
            ))}
        </MenuList>
    );
}
