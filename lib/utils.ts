import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getEnvironment, Environment } from "@/lib/environment";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getURL() {
    const environment = getEnvironment();

    const fallbackUrl =
        environment === Environment.Dev
            ? `http://localhost:${process.env.PORT || 3000}`
            : "https://yunger.dev";

    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ??
        process?.env?.NEXT_PUBLIC_VERCEL_URL ??
        fallbackUrl;

    url = url.startsWith("http") ? url : `https://${url}`;
    url = url.endsWith("/") ? url.slice(0, -1) : url;

    return url;
}

export function removeTrailingSlash(str: string): string {
    return str.replace(/\/$/, "");
}
