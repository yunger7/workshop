"use server";

import { z } from "zod";
import { noteSchema } from "@/app/about/forms";

export async function writeNote(data: z.infer<typeof noteSchema>) {
    const parsedData = noteSchema.parse(data);

    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const DISCORD_RECIPIENT_ID = process.env.DISCORD_RECIPIENT_ID;

    if (!DISCORD_BOT_TOKEN) {
        return {
            success: false,
            message: "Missing DISCORD_BOT_TOKEN environment variable",
        };
    }

    if (!DISCORD_RECIPIENT_ID) {
        return {
            success: false,
            message: "Missing DISCORD_RECIPIENT_ID environment variable",
        };
    }

    const dmChannelRes = await fetch(
        "https://discord.com/api/v10/users/@me/channels",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bot ${DISCORD_BOT_TOKEN}`,
            },
            body: JSON.stringify({ recipient_id: DISCORD_RECIPIENT_ID }),
        },
    );

    if (!dmChannelRes.ok) {
        const errorText = await dmChannelRes.text();

        return {
            success: false,
            message: `Failed to create DM channel: ${errorText}`,
        };
    }

    const dmChannel = await dmChannelRes.json();
    const channelId = dmChannel.id;

    const messageRes = await fetch(
        `https://discord.com/api/v10/channels/${channelId}/messages`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bot ${DISCORD_BOT_TOKEN}`,
            },
            body: JSON.stringify({ content: parsedData.content }),
        },
    );

    if (!messageRes.ok) {
        const errorText = await messageRes.text();

        return {
            success: false,
            message: `Failed to send DM: ${errorText}`,
        };
    }

    return {
        success: true,
    };
}
