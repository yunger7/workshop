"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { MenuList, MenuItem } from "@/components/menu";
import { ViewBox, ViewBoxHandle } from "@/components/view-box";
import { CopyButton, CopyButtonHandle } from "@/components/copy-button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const MIN_LENGTH = 8;
const DEFAULT_LENGTH = 16;
const MAX_LENGTH = 32;

export default function StrongPassword() {
    const copyButtonRef = useRef<CopyButtonHandle>(null);
    const viewBoxRef = useRef<ViewBoxHandle>(null);

    const { toast } = useToast();

    const [length, setLength] = useState(DEFAULT_LENGTH);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(false);

    const generatePassword = useCallback(() => {
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const numberChars = "0123456789";
        const symbolChars = "!@#$%^&*()_+[]{}|;:,.<>?";

        let selectedGroups: string[] = [];

        if (includeUppercase) selectedGroups.push(uppercaseChars);
        if (includeLowercase) selectedGroups.push(lowercaseChars);
        if (includeNumbers) selectedGroups.push(numberChars);
        if (includeSymbols) selectedGroups.push(symbolChars);

        if (selectedGroups.length === 0) return "";

        const passwordChars: string[] = selectedGroups.map(
            (group) => group[Math.floor(Math.random() * group.length)],
        );

        const allChars = selectedGroups.join("");

        for (let i = passwordChars.length; i < length; i++) {
            const randomChar =
                allChars[Math.floor(Math.random() * allChars.length)];
            passwordChars.push(randomChar);
        }

        for (let i = passwordChars.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [passwordChars[i], passwordChars[j]] = [
                passwordChars[j],
                passwordChars[i],
            ];
        }

        return passwordChars.join("");
    }, [
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
        length,
    ]);

    const regenerate = useCallback(() => {
        setPassword(generatePassword());
    }, [generatePassword]);

    const [password, setPassword] = useState(generatePassword());
    const [firstLoad, setFirstLoad] = useState(true);

    function getEnabledCount() {
        return [
            includeUppercase,
            includeLowercase,
            includeNumbers,
            includeSymbols,
        ].filter(Boolean).length;
    }

    function handleToggleChange(
        newValue: boolean,
        setFn: (v: boolean) => void,
    ) {
        if (!newValue && getEnabledCount() === 1) {
            toast({
                title: "At least one option must be enabled",
                description: "You cannot disable all options.",
            });
            return;
        }
        setFn(newValue);
    }

    function increaseLength() {
        setLength((prev) => Math.min(prev + 1, MAX_LENGTH));
    }

    function decreaseLength() {
        setLength((prev) => Math.max(prev - 1, MIN_LENGTH));
    }

    useEffect(() => {
        const controls = viewBoxRef?.current?.controls;

        if (firstLoad) {
            setFirstLoad(false);

            if (controls) {
                controls.start("hover");
            }
        }
    }, [firstLoad]);

    useEffect(() => {
        regenerate();
    }, [regenerate]);

    return (
        <div>
            <MenuList className="flex flex-col gap-6">
                <MenuItem
                    index={0}
                    action={() => {
                        regenerate();

                        viewBoxRef?.current?.controls
                            .start("rotate")
                            .then(() => {
                                viewBoxRef?.current?.controls.set({
                                    rotate: 90,
                                });
                            });
                    }}
                    selectAction={() => {
                        viewBoxRef?.current?.controls.start("hover");
                    }}
                    unselectAction={() => {
                        viewBoxRef?.current?.controls.start("initial");
                    }}
                >
                    <ViewBox ref={viewBoxRef}>
                        <pre>{password}</pre>
                    </ViewBox>
                </MenuItem>
                <MenuItem
                    index={1}
                    action={() => copyButtonRef.current?.copy()}
                >
                    <CopyButton
                        ref={copyButtonRef}
                        className="w-full"
                        value={password}
                    />
                </MenuItem>
                <MenuItem
                    disableClick
                    index={2}
                    action={increaseLength}
                    prevAction={decreaseLength}
                >
                    <div className="flex w-full flex-col gap-2.5">
                        <Label htmlFor="length">{length} Characters</Label>
                        <Slider
                            id="length"
                            defaultValue={[DEFAULT_LENGTH]}
                            value={[length]}
                            max={MAX_LENGTH}
                            min={MIN_LENGTH}
                            step={1}
                            onValueChange={(value) => setLength(value[0])}
                        />
                    </div>
                </MenuItem>
                <MenuItem
                    disableClick
                    index={3}
                    action={() =>
                        handleToggleChange(
                            !includeUppercase,
                            setIncludeUppercase,
                        )
                    }
                    prevAction={() =>
                        handleToggleChange(
                            !includeUppercase,
                            setIncludeUppercase,
                        )
                    }
                >
                    <Switch
                        defaultChecked
                        id="uppercase"
                        label="Include uppercase"
                        checked={includeUppercase}
                        onCheckedChange={(value) =>
                            handleToggleChange(value, setIncludeUppercase)
                        }
                    />
                </MenuItem>
                <MenuItem
                    disableClick
                    index={4}
                    action={() =>
                        handleToggleChange(
                            !includeLowercase,
                            setIncludeLowercase,
                        )
                    }
                    prevAction={() =>
                        handleToggleChange(
                            !includeLowercase,
                            setIncludeLowercase,
                        )
                    }
                >
                    <Switch
                        defaultChecked
                        id="lowercase"
                        label="Include lowercase"
                        checked={includeLowercase}
                        onCheckedChange={(value) =>
                            handleToggleChange(value, setIncludeLowercase)
                        }
                    />
                </MenuItem>
                <MenuItem
                    disableClick
                    index={5}
                    action={() =>
                        handleToggleChange(!includeNumbers, setIncludeNumbers)
                    }
                    prevAction={() =>
                        handleToggleChange(!includeNumbers, setIncludeNumbers)
                    }
                >
                    <Switch
                        defaultChecked
                        id="numbers"
                        label="Include numbers"
                        checked={includeNumbers}
                        onCheckedChange={(value) =>
                            handleToggleChange(value, setIncludeNumbers)
                        }
                    />
                </MenuItem>
                <MenuItem
                    disableClick
                    index={6}
                    action={() =>
                        handleToggleChange(!includeSymbols, setIncludeSymbols)
                    }
                    prevAction={() =>
                        handleToggleChange(!includeSymbols, setIncludeSymbols)
                    }
                >
                    <Switch
                        id="symbols"
                        label="Include symbols"
                        checked={includeSymbols}
                        onCheckedChange={(value) =>
                            handleToggleChange(value, setIncludeSymbols)
                        }
                    />
                </MenuItem>
            </MenuList>
        </div>
    );
}
