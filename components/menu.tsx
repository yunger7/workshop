"use client";

import React, {
    createContext,
    useContext,
    useState,
    useRef,
    useEffect,
} from "react";
import { IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

type MenuContextType = {
    selectedIndex: number;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
    registerMenuItem: (index: number, action: () => void) => void;
    unregisterMenuItem: (index: number) => void;
};

const MenuContext = createContext<MenuContextType | null>(null);

export function MenuList({
    children,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const totalChildren = React.Children.count(children);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const menuRegistryRef = useRef(new Map<number, () => void>());

    function registerMenuItem(index: number, action: () => void) {
        menuRegistryRef.current.set(index, action);
    }

    function unregisterMenuItem(index: number) {
        menuRegistryRef.current.delete(index);
    }

    function getMenuItemOnSelect(index: number) {
        return menuRegistryRef.current.get(index);
    }

    function next() {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % totalChildren);
    }

    function prev() {
        setSelectedIndex(
            (prevIndex) => (prevIndex + totalChildren - 1) % totalChildren,
        );
    }

    useKeyboardShortcut(["j"], next);
    useKeyboardShortcut(["ArrowDown"], next);

    useKeyboardShortcut(["k"], prev);
    useKeyboardShortcut(["ArrowUp"], prev);

    const action = getMenuItemOnSelect(selectedIndex);

    useKeyboardShortcut(["Enter"], () => action && action());
    useKeyboardShortcut(["ArrowRight"], () => action && action());
    useKeyboardShortcut(["l"], () => action && action());

    return (
        <MenuContext.Provider
            value={{
                selectedIndex,
                setSelectedIndex,
                registerMenuItem,
                unregisterMenuItem,
            }}
        >
            <div {...props}>{children}</div>
        </MenuContext.Provider>
    );
}

type MenuItemProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "children"
> & {
    index: number;
    children: React.ReactNode;
    action: () => void;
};

export function MenuItem({
    children,
    index,
    action,
    className,
    ...props
}: MenuItemProps) {
    const context = useContext(MenuContext);

    if (!context) {
        throw new Error("MenuItem must be used inside a MenuList");
    }

    const {
        selectedIndex,
        setSelectedIndex,
        registerMenuItem,
        unregisterMenuItem,
    } = context;

    useEffect(() => {
        registerMenuItem(index, action);

        return () => {
            unregisterMenuItem(index);
        };
    }, [index, action, registerMenuItem, unregisterMenuItem]);

    return (
        <button
            className={cn(
                "relative flex w-full cursor-pointer items-center justify-between focus:outline-none",
                className,
            )}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={action}
            tabIndex={-1}
            {...props}
        >
            {selectedIndex === index && (
                <span className="absolute left-0 -ml-4 -translate-x-full animate-bounce-right">
                    <IconChevronRight className="size-4" />
                </span>
            )}
            {children}
        </button>
    );
}
