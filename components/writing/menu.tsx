"use client";

import { useRouter } from "nextjs-toploader/app";
import { MenuList, MenuItem } from "@/components/menu";

type Post = { title: string; date: string; slug: string };

type MenuProps = {
    posts: Post[];
};

export function Menu({ posts }: MenuProps) {
    const router = useRouter();

    return (
        <MenuList className="flex flex-col">
            {posts.map((post, index) => (
                <MenuItem
                    key={post.title}
                    index={index}
                    className="gap-3 py-2"
                    action={() => router.push(`/writing/${post.slug}`)}
                >
                    <h2 className="text-md text-left">{post.title}</h2>
                    <div className="h-[1px] min-w-12 flex-grow border-b border-input" />
                    <div className="whitespace-nowrap">{post.date}</div>
                </MenuItem>
            ))}
        </MenuList>
    );
}
