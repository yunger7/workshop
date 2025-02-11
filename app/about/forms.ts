import { z } from "zod";

export const noteSchema = z.object({
    content: z
        .string()
        .min(1, { message: "Note cannot be empty" })
        .max(2000, { message: "Note cannot be longer than 2000 characters" }),
});
