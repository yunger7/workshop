"use client";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import xml from "highlight.js/lib/languages/xml";
import { createLowlight } from "lowlight";
import { useEditor, EditorContent } from "@tiptap/react";
import { cn } from "@/lib/utils";
import "@/public/highlight-nord.css";

const lowlight = createLowlight();

lowlight.register("xml", xml);

type CodeEditorProps = {
    className?: string;
    value?: string;
    onValueChange?: (value: string) => void;
};

export function CodeEditor({
    value,
    onValueChange,
    className,
}: CodeEditorProps) {
    const editor = useEditor({
        content: value,
        onUpdate: ({ editor }) => {
            if (onValueChange) {
                onValueChange(editor.getText());
            }
        },
        extensions: [
            Document.extend({
                content: "codeBlock+",
            }),
            Paragraph,
            Text,
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: cn("language-xml p-4", className),
                },
            }),
        ],
        editorProps: {
            attributes: {
                class: "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md bg-card",
            },
        },
    });

    if (!editor) {
        return null;
    }

    return <EditorContent spellCheck={false} editor={editor} />;
}
