"use client";

import React, {
    forwardRef,
    useImperativeHandle,
    useEffect,
    useRef,
    useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconCopy, IconCheck, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useClipboard } from "@/hooks/use-clipboard";
import { Button } from "@/components/ui/button";

export type CopyButtonProps = React.ComponentPropsWithoutRef<"button"> & {
    value: string;
};

export type CopyButtonHandle = {
    copy: () => void;
};

export const CopyButton = forwardRef<CopyButtonHandle, CopyButtonProps>(
    ({ value, className, ...props }, ref) => {
        const clipboard = useClipboard();
        const { toast } = useToast();
        const resetTimer = useRef<NodeJS.Timeout | null>(null);

        const handleCopy = useCallback(() => {
            if (resetTimer.current) {
                clearTimeout(resetTimer.current);
            }

            clipboard.copy(value);

            resetTimer.current = setTimeout(() => {
                clipboard.reset();
                resetTimer.current = null;
            }, 1000);
        }, [clipboard, value]);

        useImperativeHandle(
            ref,
            () => ({
                copy: () => {
                    handleCopy();
                },
            }),
            [handleCopy],
        );

        useEffect(() => {
            if (clipboard.error) {
                toast({
                    title: "Failed to copy",
                    description:
                        "Your browser does not allow access to clipboard",
                    variant: "destructive",
                });
            }
        }, [clipboard.error, toast]);

        useEffect(() => {
            return () => {
                if (resetTimer.current) clearTimeout(resetTimer.current);
            };
        }, []);

        function getIcon() {
            if (clipboard.error) return <IconX />;
            if (clipboard.copied) return <IconCheck />;
            return <IconCopy />;
        }

        function getText() {
            if (clipboard.error) return "Failed!";
            if (clipboard.copied) return "Copied!";
            return "Copy";
        }

        return (
            <Button
                className={cn(
                    "relative w-[100px] overflow-hidden transition-colors duration-300",
                    {
                        "bg-nord-frost-1 hover:bg-nord-frost-1":
                            clipboard.copied,
                    },
                    className,
                )}
                onClick={handleCopy}
                {...props}
            >
                <motion.div
                    className="absolute inset-0 bg-nord-frost-1"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={
                        clipboard.copied
                            ? { scale: 1, opacity: 1 }
                            : { scale: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={clipboard.copied ? "check" : "copy"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="relative z-10 flex items-center justify-center gap-2"
                    >
                        <motion.span>{getIcon()}</motion.span>
                        <motion.span className="text-sm">
                            {getText()}
                        </motion.span>
                    </motion.div>
                </AnimatePresence>
            </Button>
        );
    },
);

CopyButton.displayName = "CopyButton";
