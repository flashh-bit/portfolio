"use client";

import { useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const BrowserGuard = () => {
    const [isInApp, setIsInApp] = useState(false);

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

    if (!isInApp) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6"
            >
                <div className="max-w-md w-full bg-[#1A1A1A] border border-neutral-800 rounded-3xl p-8 shadow-2xl text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center animate-pulse">
                            <ExternalLink size={32} className="text-white" />
                        </div>
                    </div>

                    <h3 className="text-white font-bold text-xl mb-3">Browser Not Supported</h3>
                    <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                        This site uses advanced animations that don't work in this app's browser. <br />
                        Please open in <strong>Chrome</strong> or <strong>Safari</strong> to continue.
                    </p>

                    <button
                        onClick={handleOpenInChrome}
                        className="w-full bg-white text-black py-4 rounded-xl text-md font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        Open System Browser <ExternalLink size={18} />
                    </button>

                    <div className="mt-6 text-neutral-600 text-xs">
                        Tap <span className="text-white font-bold">•••</span> &rarr; Open in Browser
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
