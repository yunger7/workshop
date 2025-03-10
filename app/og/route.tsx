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
                tw="flex flex-col w-full h-full items-center justify-center bg-[#eceff4] text-[#2e3440] text-center"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, #2e344020 1px, transparent 1px), linear-gradient(to bottom, #2e344020 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            >
                <div
                    tw="w-full h-full bg-[#eceff4] absolute"
                    style={{
                        maskImage:
                            "radial-gradient(50vw circle at center, #eceff4, transparent)",
                        WebkitMaskImage:
                            "radial-gradient(50vw circle at center, #eceff4, transparent)",
                    }}
                />
                {title && <span tw="text-3xl text-[#7C89A2]">yunger.dev</span>}
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
