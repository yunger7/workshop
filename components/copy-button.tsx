"use client";

import React, {
    forwardRef,
    useImperativeHandle,
    useEffect,
    useRef,
    useCallback,
    useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconCopy, IconCheck, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useClipboard } from "@/hooks/use-clipboard";
import { Button, ButtonProps } from "@/components/ui/button";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

export type CopyButtonProps = ButtonProps & {
    value: string;
    tooltipSide?: "top" | "right" | "bottom" | "left";
};

export type CopyButtonHandle = {
    copy: () => void;
};

export const CopyButton = forwardRef<CopyButtonHandle, CopyButtonProps>(
    (
        { value, size, variant = "default", className, tooltipSide, ...props },
        ref,
    ) => {
        const clipboard = useClipboard();
        const { toast } = useToast();
        const [tooltipOpen, setTooltipOpen] = useState(false);
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

        function handleTooltipOpen(isOpen: boolean) {
            if (size !== "icon") return;
            setTooltipOpen(isOpen);
        }

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
            <Tooltip open={size === "icon" && tooltipOpen}>
                <TooltipTrigger asChild>
                    <Button
                        className={cn(
                            "relative overflow-hidden transition-colors duration-300",
                            {
                                "bg-nord-frost-1 hover:bg-nord-frost-1":
                                    clipboard.copied && variant === "default",
                            },
                            { "w-[100px]": size !== "icon" },
                            className,
                        )}
                        onClick={handleCopy}
                        onMouseEnter={() => handleTooltipOpen(true)}
                        onMouseLeave={() => handleTooltipOpen(false)}
                        variant={variant}
                        {...props}
                    >
                        <motion.div
                            className={cn("absolute inset-0", {
                                "bg-nord-frost-1": variant === "default",
                            })}
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
                                {size !== "icon" && (
                                    <motion.span className="text-sm">
                                        {getText()}
                                    </motion.span>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side={tooltipSide}>
                    <p>{getText()}</p>
                </TooltipContent>
            </Tooltip>
        );
    },
);

CopyButton.displayName = "CopyButton";
