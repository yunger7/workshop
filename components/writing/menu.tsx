"use client";

import { MenuList, MenuItem } from "@/components/menu";

type MenuProps = {
    posts: { title: string; date: string }[];
};

export function Menu({ posts }: MenuProps) {
    return (
        <MenuList className="flex flex-col">
            {posts.map((post, index) => (
                <MenuItem
                    key={post.title}
                    index={index}
                    className="gap-3 py-2"
                    action={() => console.log(post.title)}
                >
                    <h2 className="text-md text-left">{post.title}</h2>
                    <div className="h-[1px] min-w-12 flex-grow border-b border-border" />
                    <div className="whitespace-nowrap">{post.date}</div>
                </MenuItem>
            ))}
        </MenuList>
    );
}
