import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { asciiArt } from "@/components/ascii-logo";
import { getURL } from "@/lib/utils";

export const alt = "yunger.dev";
export const contentType = "image/png";
export const size = {
    width: 1200,
    height: 630,
};

export default async function OpengraphImage() {
    const url = getURL();

    const jetBrainsMonoSemiBold = await readFile(
        join(process.cwd(), "public/fonts/JetBrainsMonoNerdFont-SemiBold.ttf"),
    );

    return new ImageResponse(
        (
            <div
                tw="flex flex-col w-full h-full items-center justify-center bg-[#2e3440] text-[#eceff4] p-4"
                style={{
                    backgroundImage: `url(${url}/blueprint-background.svg)`,
                    backgroundSize: "100% 100%",
                }}
            >
                <pre tw="font-mono text-[#81a1c1] -mt-2">{asciiArt}</pre>
                <h1 tw="text-6xl tracking-tight">{alt}</h1>
            </div>
        ),
        {
            ...size,
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
