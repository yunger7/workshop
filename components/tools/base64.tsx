"use client";

import { useRef, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { MenuList, MenuItem } from "@/components/menu";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    ConvertButton,
    ConvertButtonHandle,
} from "@/components/convert-button";
import { CopyButton } from "@/components/copy-button";

const base64Schema = z.object({
    content: z.string(),
});

export default function Base64() {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const convertButtonRef = useRef<ConvertButtonHandle>(null);

    const form = useForm({
        resolver: zodResolver(base64Schema),
        defaultValues: {
            content: "",
        },
    });

    const isBase64 = (text: string): boolean => {
        if (!text?.length) return false;

        try {
            return btoa(atob(text)) === text;
        } catch {
            return false;
        }
    };

    function onSubmit(data: z.infer<typeof base64Schema>) {
        if (isBase64(data.content)) {
            const decoded = atob(data.content);
            form.setValue("content", decoded);
        } else {
            const encoded = btoa(data.content);
            form.setValue("content", encoded);
        }
    }

    function convert() {
        form.handleSubmit(onSubmit)();

        convertButtonRef?.current?.controls.start("rotate").then(() => {
            convertButtonRef?.current?.controls.set({
                rotate: 0,
            });
        });
    }

    useKeyboardShortcut(["mod", "enter"], () => convert(), {
        allowInInput: true,
    });

    useEffect(() => {
        textareaRef?.current?.focus();
    }, []);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <MenuList className="flex flex-col gap-6">
                    <MenuItem
                        disableClick
                        index={0}
                        selectAction={() => textareaRef?.current?.focus()}
                        unselectAction={() => textareaRef?.current?.blur()}
                    >
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field: { ref, ...field } }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Your text</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Textarea
                                                className="min-h-[250px]"
                                                ref={(e) => {
                                                    ref(e);
                                                    textareaRef.current = e;
                                                }}
                                                {...field}
                                            />
                                            <CopyButton
                                                type="button"
                                                size="icon"
                                                variant="outline"
                                                tooltipSide="top"
                                                className="absolute -right-7 top-[calc(50%-1.13rem)] aspect-square translate-x-1/2"
                                                value={form.getValues().content}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </MenuItem>
                    <MenuItem disableClick index={1} action={convert}>
                        <ConvertButton
                            ref={convertButtonRef}
                            type="submit"
                            className="flex w-full items-center justify-center"
                        >
                            <span className="flex min-w-[142px] items-center gap-2">
                                Convert to{" "}
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={
                                            isBase64(form.getValues().content)
                                                ? "text"
                                                : "base64"
                                        }
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className="relative z-10 flex items-center justify-center gap-2"
                                    >
                                        <motion.span className="text-sm">
                                            {isBase64(form.getValues().content)
                                                ? "text"
                                                : "base64"}
                                        </motion.span>
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                        </ConvertButton>
                    </MenuItem>
                </MenuList>
            </form>
        </Form>
    );
}
