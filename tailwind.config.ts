import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ["var(--font-jet-brains-mono)"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))",
                },
                nord: {
                    polar: {
                        "1": "var(--polar-night-1)",
                        "2": "var(--polar-night-2)",
                        "3": "var(--polar-night-3)",
                        "4": "var(--polar-night-4)",
                    },
                    snow: {
                        "1": "var(--snow-storm-1)",
                        "2": "var(--snow-storm-2)",
                        "3": "var(--snow-storm-3)",
                    },
                    frost: {
                        "1": "var(--frost-1)",
                        "2": "var(--frost-2)",
                        "3": "var(--frost-3)",
                        "4": "var(--frost-4)",
                    },
                    red: {
                        DEFAULT: "var(--aurora-red)",
                    },
                    orange: {
                        DEFAULT: "var(--aurora-orange)",
                    },
                    yellow: {
                        DEFAULT: "var(--aurora-yellow)",
                    },
                    green: {
                        DEFAULT: "var(--aurora-green)",
                    },
                    purple: {
                        DEFAULT: "var(--aurora-purple)",
                    },
                },
            },
            keyframes: {
                "bounce-right": {
                    "0%, 100%": {
                        transform: "translateX(-20%)",
                        animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
                    },
                    "50%": {
                        transform: "none",
                        animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
                    },
                },
            },
            animation: {
                "bounce-right": "bounce-right 1s infinite",
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require("@tailwindcss/typography"),
    ],
} satisfies Config;
