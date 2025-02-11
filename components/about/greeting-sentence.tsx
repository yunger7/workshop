"use client";

import React, { useState, useEffect } from "react";
import {
    Icon,
    IconProps,
    IconCoffee,
    IconSun,
    IconMoon,
    IconSunset2,
    IconDoor,
} from "@tabler/icons-react";

enum TimeOfDay {
    MORNING = "morning",
    AFTERNOON = "afternoon",
    EVENING = "evening",
    NIGHT = "night",
}

export function GreetingSentence() {
    const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(
        TimeOfDay.EVENING,
    );

    function getText(timeOfDay: TimeOfDay | null) {
        if (!timeOfDay) {
            return "Come on in, there's plenty to explore inside.";
        }

        let text = "Come on in, ";

        const TextMap: Record<TimeOfDay, string> = {
            [TimeOfDay.MORNING]:
                "it's still early in the morning, perfect for a fresh cup of coffee.",
            [TimeOfDay.AFTERNOON]:
                "the sun is still high in the sky, and there's plenty to explore inside.",
            [TimeOfDay.EVENING]:
                "it may be a bit late, but this place is always open for those who wander in.",
            [TimeOfDay.NIGHT]: "we don't have many visitors around this time.",
        };

        text += TextMap[timeOfDay];

        return text;
    }

    function getIcon(timeOfDay: TimeOfDay | null) {
        let Icon: React.ForwardRefExoticComponent<
            IconProps & React.RefAttributes<Icon>
        > = IconDoor;

        const IconMap: Record<
            TimeOfDay,
            React.ForwardRefExoticComponent<
                IconProps & React.RefAttributes<Icon>
            >
        > = {
            [TimeOfDay.MORNING]: IconCoffee,
            [TimeOfDay.AFTERNOON]: IconSun,
            [TimeOfDay.EVENING]: IconSunset2,
            [TimeOfDay.NIGHT]: IconMoon,
        };

        if (timeOfDay) {
            Icon = IconMap[timeOfDay];
        }

        return <Icon className="-mt-1 ml-1 inline-flex size-5" />;
    }

    useEffect(() => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 11) {
            setTimeOfDay(TimeOfDay.MORNING);
        } else if (hour >= 11 && hour < 18) {
            setTimeOfDay(TimeOfDay.AFTERNOON);
        } else if (hour >= 18 && hour < 23) {
            setTimeOfDay(TimeOfDay.EVENING);
        } else {
            setTimeOfDay(TimeOfDay.NIGHT);
        }
    }, []);

    // TODO: Prevent icon from breaking to a new line without accompanying text
    return (
        <span>
            {getText(timeOfDay)}
            {getIcon(timeOfDay)}
        </span>
    );
}
