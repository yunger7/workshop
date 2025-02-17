import { MDX_DIR } from "@/lib/constants";
import { MDXData, getMDXDataFromDir, getMDXDataFromSlug } from "@/lib/mdx";

export function getAllPosts(): MDXData[] {
    return getMDXDataFromDir(MDX_DIR, {
        includeContent: true,
    });
}

export function listPosts(): MDXData[] {
    return getMDXDataFromDir(MDX_DIR);
}

export function getPostBySlug(slug: string): MDXData | null {
    return getMDXDataFromSlug(slug, {
        includeContent: true,
    });
}
