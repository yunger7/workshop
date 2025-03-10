import type { MetadataRoute } from "next";
import { getURL } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
    const url = getURL();

    const hostname = new URL(url).hostname;
    const isSubdomain = hostname.split(".").length > 2;

    return {
        rules: {
            userAgent: "*",
            allow: isSubdomain ? [] : "/",
            disallow: isSubdomain ? "/" : [],
        },
        sitemap: isSubdomain ? undefined : `${url}/sitemap.xml`,
    };
}
