import localFont from "next/font/local";

export const jetBrainsMono = localFont({
    display: "swap",
    variable: "--font-jet-brains-mono",
    fallback: ["Menlo", "Monaco", "Consolas", "monospace"],
    src: [
        {
            path: "../public/fonts/JetBrainsMonoNerdFont-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../public/fonts/JetBrainsMonoNerdFont-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../public/fonts/JetBrainsMonoNerdFont-SemiBold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../public/fonts/JetBrainsMonoNerdFont-Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../public/fonts/JetBrainsMonoNerdFont-Italic.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "../public/fonts/JetBrainsMonoNerdFont-MediumItalic.ttf",
            weight: "500",
            style: "italic",
        },
        {
            path: "../public/fonts/JetBrainsMonoNerdFont-SemiBoldItalic.ttf",
            weight: "600",
            style: "italic",
        },
        {
            path: "../public/fonts/JetBrainsMonoNerdFont-BoldItalic.ttf",
            weight: "700",
            style: "italic",
        },
    ],
});
