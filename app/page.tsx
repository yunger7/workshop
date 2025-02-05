import { AsciiLogo } from "@/components/ascii-logo";
import { Menu } from "@/components/home/menu";

export default function HomePage() {
    return (
        <main className="flex flex-col items-center justify-center gap-8">
            <AsciiLogo />
            <Menu />
            <div className="flex flex-col items-center gap-2 text-center">
                <span>yunger.dev</span>
                <span className="text-xs">v0.1.0-2ba1f6b</span>
            </div>
        </main>
    );
}
