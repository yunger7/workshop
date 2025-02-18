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
import { useGlobalKeyboardShortcuts } from "@/contexts/global-keyboard-shortcuts";

type MenuItemActions = {
    action: () => void;
    prevAction?: () => void;
};

type MenuContextType = {
    selectedIndex: number;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
    registerMenuItem: (index: number, actions: MenuItemActions) => void;
    unregisterMenuItem: (index: number) => void;
};

const MenuContext = createContext<MenuContextType | null>(null);

export function MenuList({
    children,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const totalChildren = React.Children.count(children);
    const { goBack } = useGlobalKeyboardShortcuts();
    const [selectedIndex, setSelectedIndex] = useState(0);

    const menuRegistryRef = useRef(new Map<number, MenuItemActions>());

    function registerMenuItem(index: number, actions: MenuItemActions) {
        menuRegistryRef.current.set(index, actions);
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

    function runAction() {
        const actions = getMenuItemOnSelect(selectedIndex);
        if (actions?.action) actions.action();
    }

    function runPrevAction() {
        const actions = getMenuItemOnSelect(selectedIndex);

        if (actions?.prevAction) {
            actions.prevAction();
            return;
        }

        goBack();
    }

    useKeyboardShortcut(["j"], next);
    useKeyboardShortcut(["ArrowDown"], next);

    useKeyboardShortcut(["k"], prev);
    useKeyboardShortcut(["ArrowUp"], prev);

    useKeyboardShortcut(["Enter"], runAction);
    useKeyboardShortcut(["ArrowRight"], runAction);
    useKeyboardShortcut(["l"], runAction);

    useKeyboardShortcut(["ArrowLeft"], runPrevAction);
    useKeyboardShortcut(["h"], runPrevAction);

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

type MenuItemProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    index: number;
    children: React.ReactNode;
    action: () => void;
    prevAction?: () => void;
    disableClick?: boolean;
};

export function MenuItem({
    children,
    index,
    action,
    prevAction,
    className,
    disableClick,
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
        registerMenuItem(index, { action, prevAction });

        return () => {
            unregisterMenuItem(index);
        };
    }, [index, action, prevAction, registerMenuItem, unregisterMenuItem]);

    return (
        <div
            className={cn(
                "relative flex w-full items-center justify-between focus:outline-none",
                disableClick ? "cursor-default" : "cursor-pointer",
                className,
            )}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={disableClick ? undefined : action}
            tabIndex={-1}
            {...props}
        >
            {selectedIndex === index && (
                <span className="absolute left-0 -ml-4 -translate-x-full animate-bounce-right">
                    <IconChevronRight className="size-4" />
                </span>
            )}
            {children}
        </div>
    );
}
