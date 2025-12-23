"use client";

import { useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const BrowserGuard = () => {
    const [isInApp, setIsInApp] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Detect Instagram, Facebook, LinkedIn in-app browsers
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        const inAppRegex = /Instagram|FBAN|FBAV|LinkedIn/i;

        if (inAppRegex.test(userAgent)) {
            setIsInApp(true);
        }
    }, []);

    const handleOpenInChrome = () => {
        const currentUrl = window.location.href;
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

        if (/android/i.test(userAgent)) {
            // Android Intent to force open Chrome
            const intentUrl = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
            window.location.href = intentUrl;
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
            // iOS Google Chrome Scheme
            const chromeUrl = currentUrl.replace(/^https/, 'googlechrome'); // change https -> googlechrome
            window.location.href = chromeUrl;
        } else {
            // Fallback - just open in new tab (might still be blocked but worth a try)
            window.open(currentUrl, '_system');
        }
    };

    if (!isInApp || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-[100] p-4 pb-8 bg-gradient-to-t from-black via-black/90 to-transparent"
            >
                <div className="max-w-md mx-auto bg-[#1A1A1A] border border-neutral-800 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-white font-bold text-sm mb-1">In-App Browser Detected</h3>
                        <p className="text-neutral-400 text-xs text-balance">
                            Analytics & Animations might break here.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleOpenInChrome}
                            className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            Open in Chrome <ExternalLink size={12} />
                        </button>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
                        >
                            <X size={16} className="text-white" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
