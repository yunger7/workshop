"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useSettingsContext } from "@/contexts/settings";
import { useGlobalKeyboardShortcuts } from "@/contexts/global-keyboard-shortcuts";

export function BackButton({ children }: { children: React.ReactNode }) {
    const { goBack } = useGlobalKeyboardShortcuts();
    const { enableAnimations } = useSettingsContext();

    return (
        <button onClick={goBack}>
            <div className="group relative flex items-center">
                <IconArrowLeft
                    className={cn(
                        "absolute left-0 top-1/2 -ml-7 size-5 -translate-y-1/2 opacity-40 transition-transform duration-200",
                        { "group-hover:-translate-x-1": enableAnimations },
                    )}
                />
                {children}
            </div>
        </button>
    );
}
