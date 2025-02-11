import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Source } from "@/types/source";

export function middleware(request: NextRequest) {
    const referer = request.headers.get("referer");
    const cookieSource = request.cookies.get("social-referer")?.value as
        | Source
        | undefined;

    if (!referer) {
        return NextResponse.next();
    }

    let source: Source | null = null;

    const sources: Record<string, Source> = {
        "x.com": Source.X,
        "twitter.com": Source.X,
        "linkedin.com": Source.LINKEDIN,
        "github.com": Source.GITHUB,
        "youtube.com": Source.YOUTUBE,
        "reddit.com": Source.REDDIT,
        "news.ycombinator.com": Source.HACKERNEWS,
        "tabnews.com.br": Source.TABNEWS,
        "google.com": Source.GOOGLE,
        "chat.openai.com": Source.CHATGPT,
        "chatgpt.com": Source.CHATGPT,
        "discord.com": Source.DISCORD,
    };

    for (const domain in sources) {
        if (referer.includes(domain)) {
            source = sources[domain];
            break;
        }
    }

    if (!source) {
        return NextResponse.next();
    }

    if (source !== cookieSource) {
        const url = request.nextUrl.clone();

        const response = NextResponse.redirect(url);

        response.cookies.set({
            name: "social-referer",
            value: source,
            path: "/",
            maxAge: 60 * 60, // 1 hour expiration
            httpOnly: process.env.NODE_ENV !== "development",
            sameSite: "lax",
        });

        // This has caused me great pain and suffering
        response.headers.set(
            "Cache-Control",
            "no-cache, no-store, must-revalidate",
        );

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
