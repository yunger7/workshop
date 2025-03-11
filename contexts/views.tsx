"use client";

import React, { createContext, useState, useContext } from "react";

type ViewsContextType = {
    isHelpDialogOpen: boolean;
    setIsHelpDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isSearchDialogOpen: boolean;
    setIsSearchDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isShortcutsDialogOpen: boolean;
    setIsShortcutsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isExplorerOpen: boolean;
    setIsExplorerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isCommandBarOpen: boolean;
    setIsCommandBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    is404: boolean;
    setIs404: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ViewsContext = createContext<ViewsContextType | null>(null);

export function useViewsContext() {
    const context = useContext(ViewsContext);

    if (!context) {
        throw new Error("useViewsContext must be used within a ViewsProvider");
    }

    return context;
}

type ViewsProviderProps = {
    children: React.ReactNode;
};

export function ViewsProvider({ children }: ViewsProviderProps) {
    const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
    const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
    const [isShortcutsDialogOpen, setIsShortcutsDialogOpen] = useState(false);
    const [isExplorerOpen, setIsExplorerOpen] = useState(false);
    const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
    const [is404, setIs404] = useState(false);

    return (
        <ViewsContext.Provider
            value={{
                isHelpDialogOpen,
                setIsHelpDialogOpen,
                isSearchDialogOpen,
                setIsSearchDialogOpen,
                isShortcutsDialogOpen,
                setIsShortcutsDialogOpen,
                isExplorerOpen,
                setIsExplorerOpen,
                isCommandBarOpen,
                setIsCommandBarOpen,
                is404,
                setIs404,
            }}
        >
            {children}
        </ViewsContext.Provider>
    );
}
