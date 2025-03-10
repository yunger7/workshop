import type { MetadataRoute } from "next";
import { basePaths, PathType } from "@/types/path";
import { getURL } from "@/lib/utils";
import { listPosts } from "@/lib/data/writing";

export default function sitemap(): MetadataRoute.Sitemap {
    const url = getURL();

    const PathsChangeFrequency: Record<
        PathType,
        MetadataRoute.Sitemap[number]["changeFrequency"]
    > = {
        [PathType.Home]: "yearly",
        [PathType.About]: "yearly",
        [PathType.Settings]: "yearly",
        [PathType.Tools]: "monthly",
        [PathType.Projects]: "monthly",
        [PathType.Writing]: "weekly",
    };

    function getBasePaths(): MetadataRoute.Sitemap {
        return basePaths.map((path) => {
            const isHome = path === "/";

            return {
                url: url + path,
                lastModified: new Date(),
                priority: isHome ? 1 : 0.5,
                changeFrequency:
                    PathsChangeFrequency[
                        isHome ? PathType.Home : (path.slice(1) as PathType)
                    ],
            };
        });
    }

    function getWritingPaths(): MetadataRoute.Sitemap {
        const posts = listPosts();

        return posts.map((post) => ({
            url: `${url}/writing/${post.slug}`,
            lastModified: new Date(post.metadata.publishedAt),
            priority: 0.8,
            changeFrequency: "yearly",
        }));
    }

    return [...getBasePaths(), ...getWritingPaths()];
}
