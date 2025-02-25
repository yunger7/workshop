"use client";

import React, { createContext } from "react";
import { Path } from "@/types/path";
import { SearchDialog } from "@/components/search-dialog";
import { HelpDialog } from "@/components/help-dialog";
import { ShortcutsDialog } from "@/components/shortcuts-dialog";

type ViewsContextType = {
    isHelpDialogOpen: boolean;
    setIsHelpDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isSearchDialogOpen: boolean;
    setIsSearchDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isShortcutsDialogOpen: boolean;
    setIsShortcutsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ViewsContext = createContext<ViewsContextType | null>(null);

export function useViewsContext() {
    const context = React.useContext(ViewsContext);

    if (!context) {
        throw new Error("useViewsContext must be used within a ViewsProvider");
    }

    return context;
}

type ViewsProviderProps = {
    children: React.ReactNode;
    paths: Path[];
};

export function ViewsProvider({ children, paths }: ViewsProviderProps) {
    const [isHelpDialogOpen, setIsHelpDialogOpen] = React.useState(false);
    const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false);
    const [isShortcutsDialogOpen, setIsShortcutsDialogOpen] =
        React.useState(false);

    return (
        <ViewsContext.Provider
            value={{
                isHelpDialogOpen,
                setIsHelpDialogOpen,
                isSearchDialogOpen,
                setIsSearchDialogOpen,
                isShortcutsDialogOpen,
                setIsShortcutsDialogOpen,
            }}
        >
            <SearchDialog paths={paths} />
            <HelpDialog />
            <ShortcutsDialog />
            {children}
        </ViewsContext.Provider>
    );
}
