"use client";

import { useState, useMemo, useRef } from "react";
import { faker } from "@faker-js/faker";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { CopyButton, CopyButtonHandle } from "@/components/copy-button";
import { MenuList, MenuItem } from "@/components/menu";

const MIN_LINES = 1;
const DEFAULT_LINES = 5;
const MAX_LINES = 10;

const MIN_PARAGRAPHS = 1;
const DEFAULT_PARAGRAPHS = 2;
const MAX_PARAGRAPHS = 10;

export default function LoremIpsum() {
    const copyButtonRef = useRef<CopyButtonHandle>(null);

    const [linesCount, setLinesCount] = useState(DEFAULT_LINES);
    const [paragraphsCount, setParagraphsCount] = useState(DEFAULT_PARAGRAPHS);

    const text = useMemo(() => {
        return Array.from({ length: paragraphsCount })
            .map(() => faker.lorem.sentences(linesCount))
            .join("\n\n");
    }, [linesCount, paragraphsCount]);

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

    return (
        <div>
            <pre className="mb-6 max-h-[225px] overflow-auto text-wrap rounded-md border bg-card p-4 text-justify">
                {text}
            </pre>
            <MenuList className="flex flex-col gap-8">
                <MenuItem
                    index={0}
                    action={() => copyButtonRef.current?.copy()}
                >
                    <CopyButton
                        ref={copyButtonRef}
                        className="w-full"
                        value={text}
                    />
                </MenuItem>
                <MenuItem
                    disableClick
                    index={1}
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
                            max={10}
                            min={1}
                            step={1}
                            onValueChange={(value) =>
                                setParagraphsCount(value[0])
                            }
                        />
                    </div>
                </MenuItem>
                <MenuItem
                    disableClick
                    index={2}
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
                            max={10}
                            min={1}
                            step={1}
                            onValueChange={(value) => setLinesCount(value[0])}
                        />
                    </div>
                </MenuItem>
            </MenuList>
        </div>
    );
}
