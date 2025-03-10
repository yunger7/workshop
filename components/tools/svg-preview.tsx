"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { Label } from "@/components/ui/label";
import { CodeEditor } from "@/components/code-editor";

export default function SvgPreview() {
    const [content, setContent] = useState("");
    const [objectUrl, setObjectUrl] = useState<string | null>(null);
    const prevUrlRef = useRef<string | null>(null);

    function isValidSvg(content: string): boolean {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, "image/svg+xml");
            return !doc.querySelector("parsererror");
        } catch {
            return false;
        }
    }

    useLayoutEffect(() => {
        if (prevUrlRef.current) {
            URL.revokeObjectURL(prevUrlRef.current);
        }

        if (content && isValidSvg(content)) {
            const blob = new Blob([content], { type: "image/svg+xml" });
            const newUrl = URL.createObjectURL(blob);
            setObjectUrl(newUrl);
            prevUrlRef.current = newUrl;
        } else {
            setObjectUrl(null);
            prevUrlRef.current = null;
        }
    }, [content]);

    const isValid = content && isValidSvg(content);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label htmlFor="content">SVG content</Label>
                <CodeEditor
                    value={content}
                    onValueChange={setContent}
                    className="h-[250px] overflow-auto"
                />
            </div>
            <div
                id="preview"
                className="unsearchable flex min-h-24 flex-col items-center justify-center rounded-md border border-dashed bg-background p-4"
            >
                {isValid ? (
                    objectUrl ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={objectUrl}
                                alt="SVG preview"
                                className="duration-500 animate-in fade-in"
                            />
                        </>
                    ) : null
                ) : (
                    <p className="text-muted-foreground">
                        {content ? "Invalid SVG content" : "Nothing to preview"}
                    </p>
                )}
            </div>
        </div>
    );
}
