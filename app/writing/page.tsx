import { IconRss } from "@tabler/icons-react";
import { Layout } from "@/components/layout";
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
        <Layout
            title="Writing"
            actions={[
                {
                    label: "RSS Feed",
                    icon: IconRss,
                    href: "/rss",
                },
            ]}
        >
            <Menu posts={posts} />
        </Layout>
    );
}
