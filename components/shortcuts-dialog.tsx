"use client";

import { useRouter } from "nextjs-toploader/app";
import { IconArrowRight } from "@tabler/icons-react";
import { useViewsContext } from "@/contexts/views";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useTheme } from "@/hooks/use-theme";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { KeyboardShortcut } from "@/components/ui/keyboard-shortcut";

type Shortcut = {
    key: string;
    description: string;
    action: () => void;
};

export function ShortcutsDialog() {
    const router = useRouter();
    const { toggleTheme } = useTheme();
    const {
        isShortcutsDialogOpen,
        setIsShortcutsDialogOpen,
        setIsSearchDialogOpen,
        setIsHelpDialogOpen,
    } = useViewsContext();

    const shortcuts: Shortcut[] = [
        {
            key: "f",
            description: "Find",
            action: () => setIsSearchDialogOpen(true),
        },
        {
            key: "e",
            description: "Explorer",
            action: () => console.log("explorer"),
        },
        { key: "h", description: "Home", action: () => router.push("/") },
        {
            key: "w",
            description: "Writing",
            action: () => router.push("/writing"),
        },
        {
            key: "p",
            description: "Projects",
            action: () => router.push("/projects"),
        },
        { key: "t", description: "Tools", action: () => router.push("/tools") },
        { key: "a", description: "About", action: () => router.push("/about") },
        {
            key: "s",
            description: "Settings",
            action: () => router.push("/settings"),
        },
        {
            key: "g",
            description: "GitHub",
            action: () =>
                window.open("https://github.com/yunger7/workshop", "_blank"),
        },
        { key: "T", description: "Toggle Theme", action: () => toggleTheme() },
        {
            key: "H",
            description: "Help",
            action: () => setIsHelpDialogOpen(true),
        },
        { key: "q", description: "Quit", action: () => window.close() },
    ];

    function runAction(key: string) {
        const action = shortcuts.find((s) => s.key === key)?.action;

        if (action) {
            action();
        }

        setIsShortcutsDialogOpen(false);
    }

    useKeyboardShortcut(["Space"], () => setIsShortcutsDialogOpen(false), {
        allowInDialog: true,
    });
    useKeyboardShortcut(["f"], () => runAction("f"), { allowInDialog: true });
    useKeyboardShortcut(["e"], () => runAction("e"), { allowInDialog: true });
    useKeyboardShortcut(["h"], () => runAction("h"), { allowInDialog: true });
    useKeyboardShortcut(["w"], () => runAction("w"), { allowInDialog: true });
    useKeyboardShortcut(["p"], () => runAction("p"), { allowInDialog: true });
    useKeyboardShortcut(["t"], () => runAction("t"), { allowInDialog: true });
    useKeyboardShortcut(["a"], () => runAction("a"), { allowInDialog: true });
    useKeyboardShortcut(["s"], () => runAction("s"), { allowInDialog: true });
    useKeyboardShortcut(["g"], () => runAction("g"), { allowInDialog: true });
    useKeyboardShortcut(["Shift", "t"], () => runAction("T"), {
        allowInDialog: true,
    });
    useKeyboardShortcut(["Shift", "h"], () => runAction("H"), {
        allowInDialog: true,
    });
    useKeyboardShortcut(["q"], () => runAction("q"), { allowInDialog: true });

    return (
        <Dialog
            open={isShortcutsDialogOpen}
            onOpenChange={setIsShortcutsDialogOpen}
        >
            <DialogContent className="bottom-0 top-auto w-[calc(100vw-2rem)] max-w-screen-xl -translate-y-1/4">
                <DialogTitle>Shortcuts</DialogTitle>
                <div className="grid grid-flow-col grid-rows-6 gap-4 p-8 md:grid-rows-4 lg:grid-rows-3">
                    {shortcuts.map(({ key, description }) => (
                        <div key={key} className="flex items-center gap-2">
                            <KeyboardShortcut keys={[key]} />
                            <IconArrowRight className="size-4 text-muted-foreground" />
                            <p>{description}</p>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
