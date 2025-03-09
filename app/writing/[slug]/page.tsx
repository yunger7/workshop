import readingTime from "reading-time";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Layout } from "@/components/layout";
import { Article } from "@/components/article";
import { listPosts, getPostBySlug } from "@/lib/data/writing";
import { formatDate } from "@/lib/dates";

export const dynamicParams = false;

export function generateStaticParams() {
    const posts = listPosts();

    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function PostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug;
    const post = getPostBySlug(slug);

    if (!post || !post.content) {
        notFound();
    }

    const readingTimeStats = readingTime(post.content);

    return (
        <Layout
            title={post.metadata.title}
            description={`${formatDate(post.metadata.publishedAt)} · ${readingTimeStats.text}`}
        >
            <Article>
                <MDXRemote source={post.content} />
            </Article>
        </Layout>
    );
}
