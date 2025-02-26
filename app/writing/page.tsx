import { IconRss } from "@tabler/icons-react";
import { Layout } from "@/components/layout";
import { Menu } from "@/components/writing/menu";
import { listPosts } from "@/lib/data/writing";
import { formatDate } from "@/lib/dates";

function getPosts() {
    const posts = listPosts({ sorted: true });

    return posts.map((post) => ({
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
