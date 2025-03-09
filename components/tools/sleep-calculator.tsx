"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const MINUTES_TO_SLEEP = 15;

export default function SleepCalculator() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    function calculateSuggestedTimes(startTime: Date) {
        const cycleLength = 90;
        const cycles = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        const suggestedTimes = cycles.map((cycle) => {
            const adjustedStartTime = new Date(
                startTime.getTime() + 60 * 1000 * MINUTES_TO_SLEEP,
            );
            const wakeUpTime = new Date(
                adjustedStartTime.getTime() + cycle * cycleLength * 60 * 1000,
            );

            return {
                wakeUpTime,
                sleepDuration: cycle * 1.5, // in hours
                cycles: cycle,
            };
        });

        return suggestedTimes;
    }

    const suggestedTimes = calculateSuggestedTimes(currentTime);

    return (
        <div className="flex flex-col gap-4">
            <p>
                This table shows suggested wake-up times based on sleep cycles.
            </p>
            <p>
                Sleep cycles usually last around 90 minutes. Waking up at the
                end of a cycle will help you feel more refreshed.
            </p>
            <Table className="text-nowrap border border-dashed border-input bg-background">
                <TableHeader>
                    <TableRow>
                        <TableHead>Suggested Wake-Up Time</TableHead>
                        <TableHead>Sleep Duration</TableHead>
                        <TableHead>Cycles</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {suggestedTimes.map(
                        ({ wakeUpTime, sleepDuration, cycles }, index) => (
                            <TableRow key={index}>
                                <TableCell className="flex items-center gap-4">
                                    {wakeUpTime.toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                    {[5, 6].includes(cycles) && (
                                        <Badge className="shadow-none">
                                            Best
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {sleepDuration.toFixed(1)} hours
                                </TableCell>
                                <TableCell>
                                    {cycles} cycle{cycles > 1 && "s"}
                                </TableCell>
                            </TableRow>
                        ),
                    )}
                </TableBody>
            </Table>
            <p className="text-center text-muted-foreground">
                Suggestions are based on your current time
                <br />
                {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}{" "}
                + {MINUTES_TO_SLEEP} mins to sleep
            </p>
        </div>
    );
}
