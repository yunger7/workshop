"use client";

import React, { createContext, useRef, useContext } from "react";
import { TransitionRouter } from "next-transition-router";
import { animate } from "framer-motion/dom";

type RouteTransitionsContextType = {
    ref: React.RefObject<HTMLDivElement>;
};

export const RouteTransitionsContext =
    createContext<RouteTransitionsContextType | null>(null);

export function useRouteTransitionsContext() {
    const context = useContext(RouteTransitionsContext);

    if (!context) {
        throw new Error(
            "useRouteTransitionsContext must be used within a RouteTransitionsProvider",
        );
    }

    return context;
}

type RouteTranistionProps = {
    children: React.ReactNode;
};

export function RouteTransitionsProvider({ children }: RouteTranistionProps) {
    const ref = useRef<HTMLDivElement>(null!);

    return (
        <TransitionRouter
            auto
            leave={(next, from, to) => {
                if (from === to) {
                    return next();
                }

                animate(
                    ref.current,
                    { opacity: [1, 0] },
                    { duration: 0.25, onComplete: next },
                );
            }}
            enter={(next) => {
                animate(
                    ref.current,
                    { opacity: [0, 1] },
                    { duration: 0.25, onComplete: next },
                );
            }}
        >
            <RouteTransitionsContext.Provider value={{ ref }}>
                {children}
            </RouteTransitionsContext.Provider>
        </TransitionRouter>
    );
}

export function RouteTransitionsContainer({
    children,
}: {
    children: React.ReactNode;
}) {
    const { ref } = useRouteTransitionsContext();

    return (
        <div className="h-full w-full" ref={ref}>
            {children}
        </div>
    );
}
