import { getURL } from "@/lib/utils";
import { listPosts } from "@/lib/data/writing";
import { metadata } from "@/app/layout";

export const dynamic = "force-static";

export async function GET() {
    const url = getURL();
    const posts = listPosts({ sorted: true });

    const itemsXml = posts
        .map(
            (post) => `
    <item>
        <title>${post.metadata.title}</title>
        <link>${url}/writing/${post.slug}</link>
        <guid>${url}/writing/${post.slug}</guid>
        <pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>
    </item>
    `,
        )
        .join("\n");

    const rssFeed = `
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
        <channel>
            <title>yunger.dev</title>
            <link>${url}</link>
            <description>${metadata.description || ""}</description>
            <language>en-us</language>
            <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
            ${itemsXml}
        </channel>
    </rss>
    `.trim();

    return new Response(rssFeed, {
        headers: {
            "Content-Type": "text/xml",
        },
    });
}
