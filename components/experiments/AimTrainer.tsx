"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, Flame, Square, Play } from "lucide-react";

interface TargetPosition {
    id: number;
    x: number;
    y: number;
    size: number; // For shrinking
}

export const AimTrainer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [targets, setTargets] = useState<TargetPosition[]>([]);
    const [highScore, setHighScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);

    const gameAreaRef = useRef<HTMLDivElement>(null);

    // Spawn logic
    const spawnTarget = useCallback(() => {
        const newTarget: TargetPosition = {
            id: Date.now(),
            x: Math.random() * 80 + 10, // 10-90%
            y: Math.random() * 70 + 15, // 15-85%
            size: Math.random() > 0.8 ? 0.6 : 1, // 20% chance of small target
        };
        setTargets((prev) => [...prev, newTarget]);

        // Auto-remove (Miss) logic
        setTimeout(() => {
            setTargets((prev) => {
                // If target still exists, it means it wasn't clicked -> MISS
                const stillExists = prev.find(t => t.id === newTarget.id);
                if (stillExists) {
                    setStreak(0); // Reset streak on miss
                    return prev.filter((t) => t.id !== newTarget.id);
                }
                return prev;
            });
        }, 2000); // 2 seconds lifetime
    }, []);

    useEffect(() => {
        if (!isPlaying) return;

        // Spawn rate increases as streak goes up? No, simpler for now.
        const spawnInterval = setInterval(spawnTarget, 750);

        const timerInterval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    stopGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(spawnInterval);
            clearInterval(timerInterval);
        };
    }, [isPlaying, spawnTarget]); // Removed score/highScore from deps to avoid re-renders resetting intervals

    useEffect(() => {
        if (streak > maxStreak) setMaxStreak(streak);
    }, [streak, maxStreak]);

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setTargets([]);
        setStreak(0);
        setMaxStreak(0);
        setIsPlaying(true);
    };

    const stopGame = () => {
        setIsPlaying(false);
        // Only update high score on game over
        setHighScore(prev => Math.max(prev, score));
    };

    const hitTarget = (id: number) => {
        setTargets((prev) => prev.filter((t) => t.id !== id));

        // Score Calculation
        // Base 10 + (Streak * 2)
        const points = 10 + (streak * 2);
        setScore((prev) => prev + points);
        setStreak((prev) => prev + 1);
    };

    const handleBackgroundClick = (e: React.MouseEvent) => {
        // If clicking background (miss), reset streak
        // Check if target was clicked handled by stopPropagation on button
        if (isPlaying) {
            setStreak(0);
        }
    };

    return (
        <div
            ref={gameAreaRef}
            className="w-full h-full min-h-[400px] bg-neutral-950 rounded-2xl relative overflow-hidden cursor-crosshair select-none"
            onMouseDown={handleBackgroundClick}
        >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
                <div className="flex flex-col">
                    <span className="text-white font-black text-2xl leading-none">
                        {score}
                    </span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Score</span>
                </div>

                {/* Streak Counter */}
                <div className={`flex flex-col items-center transition-all ${streak > 2 ? "scale-110" : "scale-100 opcaity-50"}`}>
                    <div className="flex items-center gap-1">
                        <Flame className={`w-5 h-5 ${streak > 4 ? "text-orange-500 animate-pulse" : "text-neutral-600"}`} />
                        <span className={`font-black text-xl ${streak > 4 ? "text-orange-400" : "text-neutral-600"}`}>
                            x{streak}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4 pointer-events-auto">
                    {/* STOP BUTTON (Only visible when playing) */}
                    {isPlaying && (
                        <button
                            onClick={(e) => { e.stopPropagation(); stopGame(); }}
                            className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-500 rounded-full transition-colors border border-red-500/20"
                            title="Stop Game"
                        >
                            <Square className="w-4 h-4 fill-current" />
                        </button>
                    )}

                    <div className="flex flex-col items-end">
                        <span className={`font-black text-2xl leading-none ${timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-white"}`}>
                            {timeLeft}s
                        </span>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Time</span>
                    </div>
                </div>
            </div>

            {/* High Score / Max Streak Overlay (When Idle) */}
            {highScore > 0 && !isPlaying && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs flex gap-3 z-20">
                    <span className="text-yellow-500">🏆 Best: {highScore}</span>
                    <span className="text-orange-500">🔥 Max Streak: {maxStreak}</span>
                </div>
            )}

            {/* Game Area */}
            {!isPlaying ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-20">
                    <Crosshair className="w-16 h-16 text-red-500 mb-4" />
                    <h3 className="text-3xl font-black text-white mb-1 uppercase italic tracking-tighter">
                        Aim Trainer <span className="text-red-500">Pro</span>
                    </h3>
                    <p className="text-neutral-400 text-sm mb-6 max-w-xs text-center">
                        Hit targets to build your <span className="text-orange-400 font-bold">STREAK</span>. Misses reset it!
                    </p>
                    {score > 0 && (
                        <div className="mb-6 flex gap-8 text-center">
                            <div>
                                <span className="block text-2xl font-bold text-white">{score}</span>
                                <span className="text-[10px] text-neutral-500 uppercase">Score</span>
                            </div>
                            <div>
                                <span className="block text-2xl font-bold text-orange-400">{maxStreak}</span>
                                <span className="text-[10px] text-neutral-500 uppercase">Streak</span>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); startGame(); }}
                        className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center gap-2"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        {timeLeft === 0 || score > 0 ? "Play Again" : "Start Game"}
                    </button>
                </div>
            ) : (
                <AnimatePresence>
                    {targets.map((target) => (
                        <motion.button
                            key={target.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: target.size, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            // Shrink animation while active
                            whileInView={{ scale: [target.size, target.size * 0.5] }}
                            transition={{ duration: 2, ease: "linear" }}

                            onMouseDown={(e) => { e.stopPropagation(); hitTarget(target.id); }}
                            className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-crosshair z-10"
                            style={{ left: `${target.x}%`, top: `${target.y}%` }}
                        >
                            <div className="absolute inset-0 rounded-full bg-red-500 border-2 border-white shadow-[0_0_15px_rgba(220,38,38,0.6)] flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full" />
                            </div>
                            {/* Target Ring Animation */}
                            <motion.div
                                className="absolute inset-[-10px] border border-red-500 rounded-full"
                                animate={{ scale: [1, 0], opacity: [1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        </motion.button>
                    ))}
                </AnimatePresence>
            )}
        </div>
    );
};
