import { getVersion } from "@/lib/version";
import { AsciiLogo } from "@/components/ascii-logo";
import { Menu } from "@/components/home/menu";

export const dynamic = "force-static";

export default async function HomePage() {
    const version = await getVersion();

    return (
        <main className="flex flex-col items-center justify-center gap-8">
            <AsciiLogo />
            <Menu />
            <div className="flex flex-col items-center gap-2 text-center">
                <span>yunger.dev</span>
                <span className="text-xs">{version}</span>
            </div>
        </main>
    );
}
