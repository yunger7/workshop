"use client";

import { useTransition } from "react";
import { z } from "zod";
import { IconPencil } from "@tabler/icons-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { noteSchema } from "@/app/about/forms";
import { writeNote } from "@/app/about/actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";

export function Note() {
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            content: "",
        },
    });

    const [isSubmitting, startTransition] = useTransition();

    function onSubmit(data: z.infer<typeof noteSchema>) {
        startTransition(() => {
            writeNote(data)
                .then((response) => {
                    if (!response?.success) {
                        throw new Error(
                            response.message ?? "Response is not successful",
                        );
                    }

                    form.reset();

                    toast({
                        title: "Note written!",
                        description: "Your note was left in the workshop",
                    });
                })
                .catch((error) => {
                    console.error(error);

                    toast({
                        title: "Uh oh! Something went wrong",
                        description: "We might be out of paper right now",
                        variant: "destructive",
                        action: (
                            <ToastAction
                                altText="Retry"
                                onClick={form.handleSubmit(onSubmit)}
                            >
                                Retry
                            </ToastAction>
                        ),
                    });
                });
        });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
            >
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Leave a note</FormLabel>
                            <FormControl>
                                <Textarea
                                    className="min-h-48 border-dashed"
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-xs">
                                Don&apos;t forget to add an address or something
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <Button
                        type="submit"
                        className="mt-2"
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? (
                            "Writing..."
                        ) : (
                            <>
                                <IconPencil />
                                Write down
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
