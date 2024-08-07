"use client";

import { useEffect } from "react";

export function RegisterSW() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/service-worker.js")
                .catch((error: unknown) => {
                    console.log("Failed to load service-worker due to", error);
                });
        }
    }, []);

    return null;
}
