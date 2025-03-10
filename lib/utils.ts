import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getURL() {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ??
        process?.env?.NEXT_PUBLIC_VERCEL_URL ??
        "https://yunger.dev";

    url = url.startsWith("http") ? url : `https://${url}`;
    url = url.endsWith("/") ? url.slice(0, -1) : url;

    return url;
}

export function removeTrailingSlash(str: string): string {
    return str.replace(/\/$/, "");
}
