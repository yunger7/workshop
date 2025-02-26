"use client";

import { IconBrandGithub } from "@tabler/icons-react";
import { useTheme } from "@/hooks/use-theme";
import { useSettingsContext } from "@/contexts/settings";
import { MenuList, MenuItem } from "@/components/menu";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export function Menu() {
    const {
        enableAnimations,
        toggleAnimations,
        enableKeyboardShortcuts,
        toggleKeyboardShortcuts,
        enableStatusBar,
        toggleStatusBar,
    } = useSettingsContext();
    const { theme, toggleTheme } = useTheme();

    let index = 0;

    return (
        <MenuList className="flex flex-col gap-4">
            <MenuItem
                disableClick
                index={index++}
                action={toggleTheme}
                prevAction={toggleTheme}
            >
                <Switch
                    id="theme"
                    label="Theme"
                    checked={theme === "light"}
                    onCheckedChange={toggleTheme}
                    switchLabels={{
                        on: "Dark",
                        off: "Light",
                    }}
                />
            </MenuItem>
            <MenuItem
                disableClick
                index={index++}
                action={toggleAnimations}
                prevAction={toggleAnimations}
            >
                <Switch
                    id="animations"
                    label="Animations"
                    checked={enableAnimations}
                    onCheckedChange={toggleAnimations}
                />
            </MenuItem>
            <MenuItem
                disableClick
                index={index++}
                action={toggleKeyboardShortcuts}
                prevAction={toggleKeyboardShortcuts}
            >
                <Switch
                    id="shortcuts"
                    label="Keyboard shortcuts"
                    checked={enableKeyboardShortcuts}
                    onCheckedChange={toggleKeyboardShortcuts}
                />
            </MenuItem>
            <MenuItem
                disableClick
                index={index++}
                action={toggleStatusBar}
                prevAction={toggleStatusBar}
            >
                <Switch
                    id="status-bar"
                    label="Status bar"
                    checked={enableStatusBar}
                    onCheckedChange={toggleStatusBar}
                />
            </MenuItem>
            <MenuItem
                index={index++}
                className="mt-2"
                action={() =>
                    window.open("https://github.com/yunger7/workshop", "_blank")
                }
            >
                <Button
                    variant="outline"
                    className="h-fit w-full justify-start"
                >
                    <IconBrandGithub className="!size-6" />
                    <div className="flex flex-col gap-1 text-left">
                        <span>View source</span>
                        <span className="text-xs text-muted-foreground">
                            The source code of this workshop is available on
                            GitHub
                        </span>
                    </div>
                </Button>
            </MenuItem>
        </MenuList>
    );
}
