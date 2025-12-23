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
                        <h3 className="text-white font-bold text-sm mb-1">Open in Browser</h3>
                        <p className="text-neutral-400 text-xs text-balance">
                            For better tracking and visuals, please open this outside of Instagram.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* 3 dots hint */}
                        <div className="hidden md:block text-neutral-500 text-xs mr-2">
                            Tap <span className="text-white font-bold">•••</span> &rarr; Open in Browser
                        </div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
                        >
                            <X size={16} className="text-white" />
                        </button>
                    </div>
                </div>
                {/* Mobile hint specifically */}
                <div className="md:hidden text-center mt-4 text-white text-sm animate-pulse">
                    👆 Tap the <span className="font-bold">3 dots (•••)</span> above <br /> and choose <span className="font-bold">Open in Browser</span>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
