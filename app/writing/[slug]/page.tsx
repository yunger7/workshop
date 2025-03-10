import type { Metadata } from "next";
import readingTime from "reading-time";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Layout } from "@/components/layout";
import { Article } from "@/components/article";
import { listPosts, getPostBySlug } from "@/lib/data/writing";
import { formatDate } from "@/lib/dates";
import { getURL } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
    const posts = listPosts();

    return posts.map((post) => ({
        slug: post.slug,
    }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata | void> {
    const slug = (await params).slug;
    const post = getPostBySlug(slug);

    if (!post) {
        return;
    }

    const { title, publishedAt } = post.metadata;

    const url = getURL();
    const ogImage = `${url}/og?title=${encodeURIComponent(title)}`;

    return {
        title,
        openGraph: {
            title,
            type: "article",
            publishedTime: publishedAt,
            url: `${url}/writing/${slug}`,
            images: [
                {
                    url: ogImage,
                },
            ],
        },
        twitter: {
            title,
            card: "summary_large_image",
            images: [ogImage],
        },
    };
}

export default async function PostPage({ params }: { params: Params }) {
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
