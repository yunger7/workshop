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
import { useViewsContext } from "@/contexts/views";

type MenuItemActions = {
    action?: () => void;
    prevAction?: () => void;
    selectAction?: () => void;
    unselectAction?: () => void;
};

type MenuContextType = {
    selectedIndex: number;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
    registerMenuItem: (index: number, actions: MenuItemActions) => void;
    unregisterMenuItem: (index: number) => void;
    isDisabled?: boolean;
};

const MenuContext = createContext<MenuContextType | null>(null);

type MenuListProps = React.ComponentPropsWithoutRef<"div"> & {
    isExplorer?: boolean;
};

export function MenuList({ children, isExplorer, ...props }: MenuListProps) {
    const { goBack } = useGlobalKeyboardShortcuts();
    const { isExplorerOpen } = useViewsContext();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const previousSelectedIndexRef = useRef(selectedIndex);

    const menuRegistryRef = useRef(new Map<number, MenuItemActions>());
    const isDisabled =
        (isExplorer && !isExplorerOpen) || (!isExplorer && isExplorerOpen);

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
        setSelectedIndex(
            (prevIndex) => (prevIndex + 1) % menuRegistryRef.current.size,
        );
    }

    function prev() {
        setSelectedIndex(
            (prevIndex) =>
                (prevIndex + menuRegistryRef.current.size - 1) %
                menuRegistryRef.current.size,
        );
    }

    function runAction() {
        const actions = getMenuItemOnSelect(selectedIndex);

        if (isDisabled) return;
        if (actions?.action) actions.action();
    }

    function runPrevAction() {
        const actions = getMenuItemOnSelect(selectedIndex);

        if (isDisabled) return;

        if (actions?.prevAction) {
            actions.prevAction();
            return;
        }

        goBack();
    }

    useEffect(() => {
        const actions = getMenuItemOnSelect(selectedIndex);

        if (actions?.selectAction) {
            actions.selectAction();
        }

        const previousActions = getMenuItemOnSelect(
            previousSelectedIndexRef.current,
        );

        if (previousActions?.unselectAction) {
            previousActions.unselectAction();
        }

        previousSelectedIndexRef.current = selectedIndex;
    }, [selectedIndex]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [isExplorerOpen]);

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
                isDisabled,
            }}
        >
            <div {...props}>{children}</div>
        </MenuContext.Provider>
    );
}

type MenuItemProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    index: number;
    children: React.ReactNode;
    action?: () => void;
    prevAction?: () => void;
    selectAction?: () => void;
    unselectAction?: () => void;
    disableClick?: boolean;
};

export function MenuItem({
    children,
    index,
    action,
    prevAction,
    selectAction,
    unselectAction,
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
        isDisabled,
    } = context;

    useEffect(() => {
        registerMenuItem(index, {
            action,
            prevAction,
            selectAction,
            unselectAction,
        });

        return () => {
            unregisterMenuItem(index);
        };
    }, [
        index,
        action,
        prevAction,
        selectAction,
        unselectAction,
        registerMenuItem,
        unregisterMenuItem,
    ]);

    const isSelected = index === selectedIndex;

    function handleMouseEnter() {
        if (isDisabled) return;

        setSelectedIndex(index);
    }

    return (
        <div
            className={cn(
                "relative flex w-full items-center justify-between focus:outline-none",
                disableClick ? "cursor-default" : "cursor-pointer",
                className,
            )}
            onMouseEnter={handleMouseEnter}
            onClick={disableClick || isDisabled ? undefined : action}
            tabIndex={-1}
            {...props}
        >
            {!isDisabled && isSelected && (
                <span className="absolute left-0 -ml-4 -translate-x-full animate-bounce-right">
                    <IconChevronRight className="size-4" />
                </span>
            )}
            {children}
        </div>
    );
}
