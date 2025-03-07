"use client";

import Link from "next/link";
import { useEffect } from "react";
import { IconCompass, IconHome } from "@tabler/icons-react";
import { useViewsContext } from "@/contexts/views";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
    const { setIs404 } = useViewsContext();

    useEffect(() => {
        setIs404(true);
        return () => setIs404(false);
    }, [setIs404]);

    return (
        <main className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="relative">
                <IconCompass className="absolute left-1/2 right-1/2 top-0 size-24 -translate-x-1/2 -translate-y-2/4 text-nord-snow-1 opacity-40 dark:text-nord-polar-2" />
                <h1 className="relative z-10 bg-gradient-to-t from-nord-frost-3 to-nord-frost-1 bg-clip-text text-8xl font-bold text-transparent">
                    404
                </h1>
            </div>
            <div className="flex max-w-screen-sm flex-col items-center gap-2">
                <h2 className="text-2xl font-bold">
                    Lost in the Digital Wilderness
                </h2>
                <p>
                    The page you&apos;re looking for seems to have wandered off
                    into uncharted territory. Hurry up and go home before you
                    catch a cold!
                </p>
            </div>
            <Link href="/">
                <Button>
                    <IconHome />
                    Go home
                </Button>
            </Link>
        </main>
    );
}
