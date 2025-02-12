import { IconRss } from "@tabler/icons-react";
import { Layout } from "@/components/layout";
import { Menu } from "@/components/writing/menu";
import { getAllPosts } from "@/lib/mdx";
import { formatDate } from "@/lib/dates";

function getPosts() {
    const posts = getAllPosts();

    const sortedPosts = posts.sort(
        (a, b) =>
            new Date(b.metadata.publishedAt).getTime() -
            new Date(a.metadata.publishedAt).getTime(),
    );

    return sortedPosts.map((post) => ({
        title: post.metadata.title,
        date: formatDate(post.metadata.publishedAt),
        slug: post.slug,
    }));
}

export default function WritingPage() {
    const posts = getPosts();

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
