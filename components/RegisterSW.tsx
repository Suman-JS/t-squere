"use client";

import { useEffect } from "react";

export function RegisterSW() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/service-worker.js")
                .catch((error) =>
                    console.error("Service Worker registration failed")
                );
        }
    }, []);

    return null;
}
