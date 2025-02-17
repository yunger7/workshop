import { getVersion } from "@/lib/version";
import { AsciiLogo } from "@/components/ascii-logo";
import { Menu } from "@/components/home/menu";

export const dynamic = "force-static";

export default async function HomePage() {
    const version = await getVersion();

    return (
        <main className="flex flex-col items-center justify-center gap-8 px-10">
            <AsciiLogo />
            <Menu />
            <div className="flex flex-col items-center gap-2 text-center text-nord-polar-2 dark:text-nord-snow-2">
                <span>yunger.dev</span>
                <a
                    href="https://github.com/yunger7/workshop"
                    className="text-xs hover:underline"
                >
                    {version}
                </a>
            </div>
        </main>
    );
}
