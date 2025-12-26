"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Timer, AlertTriangle } from "lucide-react";

type GameState = "waiting" | "ready" | "go" | "clicked" | "tooEarly" | "penalized";

export const ReactionTest = () => {
    const [gameState, setGameState] = useState<GameState>("waiting");
    const [startTime, setStartTime] = useState(0);
    const [reactionTime, setReactionTime] = useState<number | null>(null);
    const [history, setHistory] = useState<number[]>([]);

    // Average of last 5
    const average = history.length > 0
        ? Math.round(history.slice(-5).reduce((a, b) => a + b, 0) / Math.min(history.length, 5))
        : null;

    const startGame = useCallback(() => {
        setGameState("ready");
        setReactionTime(null);

        const delay = Math.random() * 3000 + 1500; // 1.5 - 4.5 seconds
        const timeout = setTimeout(() => {
            setGameState("go");
            setStartTime(Date.now());
        }, delay);

        return () => clearTimeout(timeout);
    }, []);

    const handleClick = () => {
        if (gameState === "waiting") {
            startGame();
        } else if (gameState === "ready") {
            // Early Click Penalty
            setGameState("tooEarly");
            // Lock out for 1 second before they can try again
            setTimeout(() => setGameState("waiting"), 1000);
        } else if (gameState === "go") {
            const time = Date.now() - startTime;
            setReactionTime(time);
            setHistory(prev => [...prev, time]);
            setGameState("clicked");
        } else if (gameState === "clicked") {
            setGameState("waiting");
        }
    };

    const getBackgroundColor = () => {
        switch (gameState) {
            case "waiting": return "bg-indigo-600";
            case "ready": return "bg-rose-600";
            case "go": return "bg-emerald-500";
            case "clicked": return "bg-indigo-600";
            case "tooEarly": return "bg-orange-500";
            default: return "bg-indigo-600";
        }
    };

    const getMessage = () => {
        switch (gameState) {
            case "waiting": return { title: "Click to Start", sub: "When red turns GREEN, click fast!" };
            case "ready": return { title: "Wait for Green...", sub: "Steady..." };
            case "go": return { title: "CLICK!", sub: "" };
            case "clicked": return {
                title: `${reactionTime}ms`,
                sub: "Click to try again"
            };
            case "tooEarly": return { title: "Too Early!", sub: "Locked for 1s penalty..." };
            default: return { title: "", sub: "" };
        }
    };

    const msg = getMessage();

    return (
        <motion.div
            onClick={gameState === "tooEarly" ? undefined : handleClick}
            className={`w-full h-full min-h-[350px] rounded-2xl cursor-pointer flex flex-col items-center justify-center transition-colors duration-200 relative overflow-hidden shadow-2xl ${getBackgroundColor()}`}
            whileTap={gameState !== "tooEarly" ? { scale: 0.98 } : {}}
            layout
        >
            {/* Stats Overlay */}
            <div className="absolute top-4 right-4 flex flex-col items-end pointer-events-none">
                {average && (
                    <div className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-bold flex items-center gap-2 mb-2">
                        <Timer className="w-3 h-3" />
                        Avg (Last 5): {average}ms
                    </div>
                )}
                {history.length > 0 && (
                    <div className="flex gap-1">
                        {history.slice(-5).map((t, i) => (
                            <div key={i} className="w-1 h-6 bg-white/30 rounded-full relative group">
                                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {t}ms
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Icon */}
            <div className="mb-6">
                {gameState === "waiting" || gameState === "clicked" ? <Zap className="w-16 h-16 text-white/20" /> :
                    gameState === "ready" ? <AlertTriangle className="w-16 h-16 text-white/20 animate-pulse" /> :
                        gameState === "go" ? <Zap className="w-24 h-24 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" /> :
                            <AlertTriangle className="w-16 h-16 text-white/50" />
                }
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={gameState}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                        {msg.title}
                    </h2>
                    <p className="text-white/80 text-sm font-medium">{msg.sub}</p>
                </motion.div>
            </AnimatePresence>

            {gameState === "waiting" && difficultyIndicator()}
        </motion.div>
    );
};

const difficultyIndicator = () => (
    <div className="absolute bottom-4 text-white/30 text-[10px] uppercase font-bold tracking-widest">
        reaction_test_v2.0
    </div>
);
