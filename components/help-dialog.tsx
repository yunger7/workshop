"use client";

import { useViewsContext } from "@/contexts/views";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function HelpDialog() {
    const { isHelpDialogOpen, setIsHelpDialogOpen } = useViewsContext();

    return (
        <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
            <DialogContent>
                <DialogTitle>Help</DialogTitle>
                <div className="p-6">
                    Lorem ipsum dolor sit amet, qui minim labore adipisicing
                    minim sint cillum sint consectetur cupidatat.
                </div>
            </DialogContent>
        </Dialog>
    );
}
