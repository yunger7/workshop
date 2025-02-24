"use client";

import { useViewsContext } from "@/contexts/views";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function HelpDialog() {
    const { isHelpDialogOpen, setIsHelpDialogOpen } = useViewsContext();

    return (
        <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
            <DialogContent label="Help">
                Lorem ipsum dolor sit amet, qui minim labore adipisicing minim
                sint cillum sint consectetur cupidatat.
            </DialogContent>
        </Dialog>
    );
}
