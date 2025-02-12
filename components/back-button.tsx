"use client";

import { useGlobalKeyboardShortcuts } from "@/contexts/global-keyboard-shortcuts";

export function BackButton({ children }: { children: React.ReactNode }) {
    const { goBack } = useGlobalKeyboardShortcuts();

    return <button onClick={goBack}>{children}</button>;
}
