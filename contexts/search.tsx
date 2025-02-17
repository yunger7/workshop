"use client";

import { useState, createContext, useContext } from "react";
import { SearchDialog } from "@/components/search-dialog";

type SearchContextType = {
    isSearchDialogOpen: boolean;
    setIsSearchDialogOpen: (isOpen: boolean) => void;
    toggleSearchDialogOpen: () => void;
};

export const SearchContext = createContext<SearchContextType | null>(null);

export function useSearchContext() {
    const context = useContext(SearchContext);

    if (!context) {
        throw new Error(
            "useSearchContext must be used within a SearchProvider",
        );
    }

    return context;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

    function toggleSearchDialogOpen() {
        setIsSearchDialogOpen((prev) => !prev);
    }

    return (
        <SearchContext.Provider
            value={{
                isSearchDialogOpen,
                setIsSearchDialogOpen,
                toggleSearchDialogOpen,
            }}
        >
            <SearchDialog />
            {children}
        </SearchContext.Provider>
    );
}
