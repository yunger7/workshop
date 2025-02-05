import { useState, useEffect } from "react";

export function useOS() {
    const [os, setOS] = useState<"windows" | "macos" | "linux" | null>(null);

    useEffect(() => {
        const platform = navigator.platform.toLowerCase();

        if (platform.includes("win")) {
            return setOS("windows");
        }

        if (platform.includes("mac")) {
            return setOS("macos");
        }

        if (platform.includes("linux")) {
            return setOS("linux");
        }
    }, []);

    return os;
}
