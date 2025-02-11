import { cookies } from "next/headers";
import { Source } from "@/types/source";

export async function RefererSentence() {
    const cookieStore = await cookies();
    const referer = cookieStore.get("social-referer")?.value as
        | Source
        | undefined;

    function getText(referer?: Source) {
        if (!referer || !Object.values(Source).includes(referer)) {
            return "You seem to be new here, where did you learn about this place?";
        }

        if (referer === Source.GOOGLE || referer === Source.CHATGPT) {
            return `I see you just arrived straight from ${referer}. Well, this is must be the place you're looking for!`;
        }

        let quote = `I see you just arrived from ${referer}, `;

        quote += {
            [Source.X]: "you must be tired of all that scrolling, right?",
            [Source.GITHUB]: "why not take a break from all that code?",
            [Source.LINKEDIN]:
                "all that networking can be exhausting, wouldn't you agree?",
            [Source.YOUTUBE]:
                "the algorithm must've trapped you again, didn't it?",
            [Source.HACKERNEWS]:
                "would you like a break from all the startup drama and tech debates?",
            [Source.TABNEWS]: "have you found some high value posts in there?",
            [Source.REDDIT]:
                "did you perhaps got tired of seeing the same old posts on your feed?",
            [Source.DISCORD]:
                "was it a friend of yours that mentioned this place?",
        }[referer];

        return quote;
    }

    return <span>{getText(referer)}</span>;
}
