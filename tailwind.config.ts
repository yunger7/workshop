import type { Config } from "tailwindcss";

export default {
    content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            fontFamily: {
                mono: ["var(--font-jet-brains-mono)"],
            },
        },
    },
    plugins: [],
} satisfies Config;
