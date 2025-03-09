"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { CodeEditor } from "@/components/code-editor";

export default function SvgPreview() {
    const [content, setContent] = useState("");
    const [objectUrl, setObjectUrl] = useState<string | null>(null);

    function isValidSvg(content: string): boolean {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, "image/svg+xml");
            return !doc.querySelector("parsererror");
        } catch {
            return false;
        }
    }

    useEffect(() => {
        let url: string | null = null;

        if (content && isValidSvg(content)) {
            const blob = new Blob([content], { type: "image/svg+xml" });
            url = URL.createObjectURL(blob);
            setObjectUrl(url);
        } else {
            setObjectUrl(null);
        }

        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [content]);

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
                {objectUrl ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={objectUrl} alt="SVG preview" />
                    </>
                ) : (
                    <p className="text-muted-foreground">
                        {content ? "Invalid SVG content" : "Nothing to preview"}
                    </p>
                )}
            </div>
        </div>
    );
}
