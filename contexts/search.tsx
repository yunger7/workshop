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

export enum PathType {
    Writing = "writing",
    Tool = "tool",
    Project = "project",
}

export type Path = {
    type: PathType;
    alt: string;
    href: string;
};

type SearchProviderProps = {
    children: React.ReactNode;
    paths: Path[];
};

export function SearchProvider({ children, paths }: SearchProviderProps) {
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
            <SearchDialog paths={paths} />
            {children}
        </SearchContext.Provider>
    );
}
