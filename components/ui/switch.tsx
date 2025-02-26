"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

type SwitchProps = React.ComponentPropsWithoutRef<
    typeof SwitchPrimitives.Root
> & {
    id: string;
    label: string;
    switchLabels?: {
        on: string;
        off: string;
    };
};

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    SwitchProps
>(({ className, id, label, switchLabels, ...props }, ref) => (
    <div className="flex w-full items-center justify-between gap-2">
        <Label htmlFor={id} className="w-full">
            {label}
        </Label>
        <SwitchPrimitives.Root
            id={id}
            className={cn(
                "peer inline-flex cursor-pointer items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
            ref={ref}
        >
            <span
                className={cn("mr-2 font-medium", {
                    "text-primary underline": !props.checked,
                })}
            >
                {switchLabels?.on ?? "No"}
            </span>
            /
            <span
                className={cn("ml-2 font-medium", {
                    "text-primary underline": props.checked,
                })}
            >
                {switchLabels?.off ?? "Yes"}
            </span>
        </SwitchPrimitives.Root>
    </div>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
