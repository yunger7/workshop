import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Source } from "@/types/source";

export function middleware(req: NextRequest) {
    const referer = req.headers.get("referer");
    const cookieSource = req.cookies.get("source")?.value as Source | undefined;

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
        const response = NextResponse.next();

        response.cookies.set("social-referer", source, {
            path: "/",
            maxAge: 60 * 60, // 1 hour expiration
            httpOnly: false,
        });

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
