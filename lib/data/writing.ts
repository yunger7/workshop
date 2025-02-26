import { MDX_DIR } from "@/lib/constants";
import { MDXData, getMDXDataFromDir, getMDXDataFromSlug } from "@/lib/mdx";

export function getAllPosts(): MDXData[] {
    return getMDXDataFromDir(MDX_DIR, {
        includeContent: true,
    });
}

type ListPostsOptions = {
    sorted?: boolean;
};

export function listPosts(options?: ListPostsOptions): MDXData[] {
    let posts = getMDXDataFromDir(MDX_DIR);

    if (options?.sorted) {
        posts = posts.sort(
            (a, b) =>
                new Date(b.metadata.publishedAt).getTime() -
                new Date(a.metadata.publishedAt).getTime(),
        );
    }

    return posts;
}

export function getPostBySlug(slug: string): MDXData | null {
    return getMDXDataFromSlug(slug, {
        includeContent: true,
    });
}
