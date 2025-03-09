"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { faker } from "@faker-js/faker";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { CopyButton, CopyButtonHandle } from "@/components/copy-button";
import { MenuList, MenuItem } from "@/components/menu";
import { ViewBox, ViewBoxHandle } from "@/components/view-box";

const MIN_LINES = 1;
const DEFAULT_LINES = 5;
const MAX_LINES = 10;

const MIN_PARAGRAPHS = 1;
const DEFAULT_PARAGRAPHS = 2;
const MAX_PARAGRAPHS = 10;

export default function LoremIpsum() {
    const copyButtonRef = useRef<CopyButtonHandle>(null);
    const viewBoxRef = useRef<ViewBoxHandle>(null);

    const [linesCount, setLinesCount] = useState(DEFAULT_LINES);
    const [paragraphsCount, setParagraphsCount] = useState(DEFAULT_PARAGRAPHS);

    let index = 0;

    const generateText = useCallback(() => {
        return Array.from({ length: paragraphsCount })
            .map(() => faker.lorem.sentences(linesCount))
            .join("\n\n");
    }, [paragraphsCount, linesCount]);

    const regenerate = useCallback(() => {
        setText(generateText());
    }, [generateText]);

    const [text, setText] = useState(generateText());
    const [firstLoad, setFirstLoad] = useState(true);

    function increaseParagraphsCount() {
        setParagraphsCount((prevCount) =>
            Math.min(prevCount + 1, MAX_PARAGRAPHS),
        );
    }

    function decreaseParagraphsCount() {
        setParagraphsCount((prevCount) =>
            Math.max(prevCount - 1, MIN_PARAGRAPHS),
        );
    }

    function increaseLinesCount() {
        setLinesCount((prevCount) => Math.min(prevCount + 1, MAX_LINES));
    }

    function decreaseLinesCount() {
        setLinesCount((prevCount) => Math.max(prevCount - 1, MIN_LINES));
    }

    useKeyboardShortcut(["mod", "enter"], () => copyButtonRef.current?.copy());

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
            <MenuList className="flex flex-col gap-8">
                <MenuItem
                    index={index++}
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
                    <ViewBox ref={viewBoxRef} className="p-0">
                        <pre className="max-h-[250px] overflow-hidden overflow-y-auto text-wrap p-4 text-justify">
                            {text}
                        </pre>
                    </ViewBox>
                </MenuItem>
                <MenuItem
                    index={index++}
                    action={() => copyButtonRef.current?.copy()}
                    className="-mt-2"
                >
                    <CopyButton
                        ref={copyButtonRef}
                        className="w-full"
                        value={text}
                    />
                </MenuItem>
                <MenuItem
                    disableClick
                    index={index++}
                    action={increaseParagraphsCount}
                    prevAction={decreaseParagraphsCount}
                    className="mb-2"
                >
                    <div className="flex w-full flex-col gap-2.5">
                        <Label htmlFor="paragraphs">
                            {paragraphsCount} Paragraph
                            {paragraphsCount > 1 ? "s" : ""}
                        </Label>
                        <Slider
                            id="paragraphs"
                            className="-mb-4"
                            defaultValue={[DEFAULT_PARAGRAPHS]}
                            value={[paragraphsCount]}
                            max={MAX_PARAGRAPHS}
                            min={MIN_PARAGRAPHS}
                            step={1}
                            onValueChange={(value) =>
                                setParagraphsCount(value[0])
                            }
                        />
                    </div>
                </MenuItem>
                <MenuItem
                    disableClick
                    index={index++}
                    action={increaseLinesCount}
                    prevAction={decreaseLinesCount}
                    className="mb-4"
                >
                    <div className="flex w-full flex-col gap-2.5">
                        <Label htmlFor="lines">
                            {linesCount} Line{linesCount > 1 ? "s" : ""} per
                            paragraph
                        </Label>
                        <Slider
                            id="lines"
                            className="-mb-4"
                            defaultValue={[DEFAULT_LINES]}
                            value={[linesCount]}
                            max={MAX_LINES}
                            min={MIN_LINES}
                            step={1}
                            onValueChange={(value) => setLinesCount(value[0])}
                        />
                    </div>
                </MenuItem>
            </MenuList>
        </div>
    );
}
