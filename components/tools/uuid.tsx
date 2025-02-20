"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { MenuList, MenuItem } from "@/components/menu";
import { CopyButton, CopyButtonHandle } from "@/components/copy-button";
import { ViewBox, ViewBoxHandle } from "@/components/view-box";

export default function UUID() {
    const copyButtonRef = useRef<CopyButtonHandle>(null);
    const viewBoxRef = useRef<ViewBoxHandle>(null);

    const [uuid, setUuid] = useState(uuidv4());
    const [firstLoad, setFirstLoad] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const controls = viewBoxRef?.current?.controls;

        if (!firstLoad && controls) {
            controls.start("rotate").then(() => {
                if (isMounted) {
                    controls.set({ rotate: 90 });
                }
            });
        }

        if (firstLoad) {
            setFirstLoad(false);

            if (controls) {
                controls.start("hover");
            }
        }

        return () => {
            isMounted = false;
            controls?.stop();
        };
    }, [uuid, firstLoad]);

    function regenerate() {
        setUuid(uuidv4());
    }

    return (
        <div>
            <MenuList className="flex flex-col gap-6">
                <MenuItem
                    index={0}
                    action={regenerate}
                    selectAction={() =>
                        viewBoxRef?.current?.controls.start("hover")
                    }
                    unselectAction={() =>
                        viewBoxRef?.current?.controls.start("initial")
                    }
                >
                    <ViewBox ref={viewBoxRef}>{uuid}</ViewBox>
                </MenuItem>
                <MenuItem
                    index={1}
                    action={() => copyButtonRef?.current?.copy()}
                >
                    <CopyButton
                        ref={copyButtonRef}
                        className="w-full"
                        value={uuid}
                    />
                </MenuItem>
            </MenuList>
        </div>
    );
}
