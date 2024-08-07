/* eslint-disable @typescript-eslint/no-unsafe-member-access */

"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const ConnectivityBanner = () => {
    const [isOnline, setIsOnline] = useState(true);
    const [showWelcomeBack, setShowWelcomeBack] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowWelcomeBack(true);
            setTimeout(() => setShowWelcomeBack(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        const handleMessage = (event: MessageEvent) => {
            if (
                event.data &&
                typeof event.data === "object" &&
                "type" in event.data
            ) {
                if (event.data.type === "ONLINE") {
                    handleOnline();
                } else if (event.data.type === "OFFLINE") {
                    handleOffline();
                }
            }
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.addEventListener("message", handleMessage);
        }

        setIsOnline(navigator.onLine);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker.removeEventListener(
                    "message",
                    handleMessage
                );
            }
        };
    }, []);

    if (isOnline && !showWelcomeBack) return null;

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 z-[1000] bg-gray-950 p-1 text-center text-sm text-white transition-all",
                isOnline ? "bg-[#00b845]" : "bg-[#212121]"
            )}
        >
            {isOnline ? "Back online" : "No internet connection"}
        </div>
    );
};

export default ConnectivityBanner;
