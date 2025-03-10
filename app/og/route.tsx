import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const title = url.searchParams.get("title");

    const jetBrainsMonoSemiBold = await readFile(
        join(process.cwd(), "public/fonts/JetBrainsMonoNerdFont-SemiBold.ttf"),
    );

    return new ImageResponse(
        (
            <div
                tw="flex flex-col w-full h-full items-center justify-center bg-[#2e3440] text-[#eceff4] text-center"
                style={{
                    backgroundColor: "#2e3440",
                    backgroundImage: `
          linear-gradient(#5E81AC44 1px, transparent 1px),
          linear-gradient(90deg, #5E81AC44 1px, transparent 1px),
          linear-gradient(#5E81AC22 1px, transparent 1px),
          linear-gradient(90deg, #5E81AC22 1px, transparent 1px)
        `,
                    backgroundSize:
                        "150px 150px, 150px 150px, 30px 30px, 30px 30px",
                    backgroundPosition:
                        "-1px -1px, -1px -1px, -1px -1px, -1px -1px",
                }}
            >
                {title && <span tw="text-3xl text-[#ABB9CF]">yunger.dev</span>}
                <h1 tw="text-6xl tracking-tight">{title || "yunger.dev"}</h1>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: "JetBrainsMono Nerd Font",
                    data: jetBrainsMonoSemiBold,
                    style: "normal",
                    weight: 600,
                },
            ],
        },
    );
}
