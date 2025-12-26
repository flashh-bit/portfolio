"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Timer, Eye, Brain, Heart, HeartCrack } from "lucide-react";

// Using distinct sets for clear differentiation
const CARD_SETS = {
    easy: ["🎮", "🎯", "🚀", "⚡", "🔥", "💎", "🎲", "🎱"], // 8 unique
    medium: ["🎮", "🎯", "🚀", "⚡", "🔥", "💎", "🎨", "🎵", "🌟", "🎪", "🎭", "🎬"], // 12 unique
    hard: ["🎮", "🎯", "🚀", "⚡", "🔥", "💎", "🎨", "🎵", "🌟", "🎪", "🎭", "🎬", "🛸", "👾", "🤖", "👻"], // 16 unique
};

type Difficulty = "easy" | "medium" | "hard";
type GamePhase = "idle" | "memorize" | "recall" | "result";

interface Card {
    id: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean; // Reused to show correct/incorrect selection
}

export const MemoryGame = () => {
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [phase, setPhase] = useState<GamePhase>("idle");
    const [cards, setCards] = useState<Card[]>([]);
    const [targets, setTargets] = useState<string[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Timer for memorization phase
    const [timeLeft, setTimeLeft] = useState(10);
    // Lives / Chances
    const [lives, setLives] = useState(2);

    // Scoring
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);

    const processingRef = useRef(false);

    // Memorization Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (phase === "memorize" && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        } else if (phase === "memorize" && timeLeft === 0) {
            startRecallPhase();
        }
        return () => clearInterval(interval);
    }, [phase, timeLeft]);

    const startGame = (diff: Difficulty) => {
        // Set timer based on difficulty
        const timerMap = { easy: 30, medium: 45, hard: 60 };
        const initialTime = timerMap[diff];

        const emojis = CARD_SETS[diff];
        // NO DUPLICATION - Unique cards only
        const gameEmojis = [...emojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                emoji,
                isFlipped: false, // Start Face Down for "Reveal" effect
                isMatched: false,
            }));

        setCards(gameEmojis);
        setDifficulty(diff);
        setPhase("memorize");
        setTimeLeft(initialTime);
        setScore(0);
        setRound(1);
        setLives(2);
        setSelectedIds([]);
        setTargets([]);
        processingRef.current = false;

        // Reveal animation after small delay
        setTimeout(() => {
            setCards(prev => prev.map(c => ({ ...c, isFlipped: true })));
        }, 300);
    };

    const startRecallPhase = () => {
        // 1. Flip all cards down
        setCards((prev) => prev.map((c) => ({ ...c, isFlipped: false })));

        // 2. Pick 2 random emojis that exist in the deck to be targets
        if (!difficulty) return;

        const distinctEmojis = CARD_SETS[difficulty];
        // Pick 2 random distinct emojis
        const shuffled = [...distinctEmojis].sort(() => Math.random() - 0.5);
        const targetEmojis = [shuffled[0], shuffled[1]];

        setTargets(targetEmojis);
        setPhase("recall");
    };

    const handleCardClick = (id: number) => {
        if (phase !== "recall" || processingRef.current) return;

        const card = cards.find((c) => c.id === id);
        // Prevent selecting same card or if already matched
        if (!card || selectedIds.includes(id) || card.isMatched) return;

        // Flip the card
        const updatedCards = cards.map((c) =>
            c.id === id ? { ...c, isFlipped: true } : c
        );
        setCards(updatedCards);

        const newSelected = [...selectedIds, id];
        setSelectedIds(newSelected);

        if (newSelected.length === 2) {
            processingRef.current = true;
            checkResult(newSelected, updatedCards);
        }
    };

    const checkResult = (selected: number[], currentCards: Card[]) => {
        const card1 = currentCards.find(c => c.id === selected[0]);
        const card2 = currentCards.find(c => c.id === selected[1]);

        if (!card1 || !card2) return;

        const foundEmojis = [card1.emoji, card2.emoji];
        // We need to find BOTH targets from the grid
        const hasTarget1 = foundEmojis.includes(targets[0]);
        const hasTarget2 = foundEmojis.includes(targets[1]);

        const isSuccess = hasTarget1 && hasTarget2;

        setTimeout(() => {
            if (isSuccess) {
                setScore(s => s + 100);
                // Mark correct and KEEP FLIPPED
                setCards(prev => prev.map(c =>
                    selected.includes(c.id) ? { ...c, isMatched: true } : c
                ));
                // Show result modal
                setPhase("result");
            } else {
                // Incorrect
                const newLives = lives - 1;
                setLives(newLives);

                if (newLives === 0) {
                    // Game Over
                    setPhase("result");
                } else {
                    // Just flip back and retry
                    setCards(prev => prev.map(c =>
                        selected.includes(c.id) ? { ...c, isFlipped: false } : c
                    ));
                }
            }

            setSelectedIds([]); // Allow new selection
            processingRef.current = false;
        }, 1000);
    };

    const nextRound = () => {
        if (!difficulty) return;
        setCards(prev => prev.map(c => c.isMatched ? c : { ...c, isFlipped: false }));

        const distinctEmojis = CARD_SETS[difficulty];
        const shuffled = [...distinctEmojis].sort(() => Math.random() - 0.5);
        const newTargets = [shuffled[0], shuffled[1]];
        setTargets(newTargets);
        setSelectedIds([]);
        setLives(2); // Reset lives for new round
        setPhase("recall");
        setRound(r => r + 1);
    };

    const resetGame = () => {
        setPhase("idle");
        setDifficulty(null);
        setCards([]);
        setScore(0);
        setRound(0);
        processingRef.current = false;
    };

    const getGridCols = () => {
        if (!difficulty) return 4;
        return difficulty === "easy" ? 4 : difficulty === "medium" ? 4 : 4;
    };

    // --- RENDER ---

    if (!difficulty) {
        return (
            <div className="w-full h-full min-h-[450px] bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950 rounded-2xl p-6 flex flex-col items-center justify-center">
                <Brain className="w-16 h-16 text-purple-400 mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">Memory Challenge</h3>
                <p className="text-purple-300/70 text-sm mb-8 text-center max-w-xs">
                    Memorize the grid. Then find the requested emojis!
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                    {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
                        <motion.button
                            key={diff}
                            onClick={() => startGame(diff)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-6 py-4 rounded-xl font-bold text-white capitalize transition-all border border-white/10 ${diff === "easy"
                                ? "bg-green-600/20 hover:bg-green-600/40 text-green-300"
                                : diff === "medium"
                                    ? "bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300"
                                    : "bg-red-600/20 hover:bg-red-600/40 text-red-300"
                                }`}
                        >
                            {diff} Grid
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950 rounded-2xl p-4 flex flex-col relative overflow-hidden">

            {/* Header / HUD */}
            <div className="flex justify-between items-center mb-4 z-10 w-full px-2">
                <div className="flex items-center gap-4">
                    {/* Score */}
                    <div className="flex flex-col">
                        <span className="text-[10px] text-purple-300 uppercase font-bold tracking-wider">Score</span>
                        <span className="text-xl font-black text-white">{score}</span>
                    </div>

                    <div className="h-8 w-[1px] bg-white/10" />

                    {/* Lives */}
                    <div className="flex flex-col">
                        <span className="text-[10px] text-purple-300 uppercase font-bold tracking-wider">Chances</span>
                        <div className="flex gap-1 h-6 items-center">
                            {[...Array(2)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={false}
                                    animate={{
                                        scale: i < lives ? 1 : 0.8,
                                        opacity: i < lives ? 1 : 0.3,
                                        filter: i < lives ? "grayscale(0%)" : "grayscale(100%)"
                                    }}
                                >
                                    <Heart className={`w-5 h-5 ${i < lives ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="h-8 w-[1px] bg-white/10" />

                    {/* Round */}
                    <div className="flex flex-col">
                        <span className="text-[10px] text-purple-300 uppercase font-bold tracking-wider">Round</span>
                        <span className="text-xl font-black text-white">{round}</span>
                    </div>
                </div>

                <button onClick={resetGame} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <RotateCcw className="w-5 h-5 text-purple-400" />
                </button>
            </div>

            {/* Phase Instructions */}
            <div className="mb-6 z-10 min-h-[80px] flex flex-col justify-center">
                {phase === "memorize" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center"
                    >
                        <div className="text-3xl font-black text-white mb-1 flex items-center gap-3">
                            <Eye className="w-8 h-8 text-cyan-400" />
                            {timeLeft}s
                        </div>
                        <p className="text-purple-300 text-sm">Memorize the card positions!</p>
                        <button
                            onClick={startRecallPhase}
                            className="mt-2 text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-white transition-colors"
                        >
                            Skip Timer ⏩
                        </button>
                    </motion.div>
                )}

                {(phase === "recall" || phase === "result") && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center"
                    >
                        <p className="text-purple-300 text-xs mb-2 uppercase tracking-widest font-bold">Find these cards</p>
                        <div className="flex gap-4">
                            {targets.map((t, i) => (
                                <div key={i} className="w-12 h-12 bg-black/40 rounded-xl border border-purple-500/30 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                    {t}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Result Overlay */}
            <AnimatePresence>
                {phase === "result" && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                        <div className="flex flex-col items-center text-center p-6">
                            {lives > 0 ? (
                                <>
                                    <Trophy className="w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
                                    <h2 className="text-3xl font-black text-white mb-2">Perfect!</h2>
                                    <p className="text-cyan-300 font-bold mb-6">Round {round} Completed!</p>
                                    <button
                                        onClick={nextRound}
                                        className="px-8 py-3 bg-purple-500 hover:bg-purple-600 rounded-full text-white font-bold shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
                                    >
                                        Next Round →
                                    </button>
                                </>
                            ) : (
                                <>
                                    <HeartCrack className="w-16 h-16 text-red-500 mb-4" />
                                    <h2 className="text-3xl font-black text-white mb-2">Game Over!</h2>
                                    <p className="text-purple-300 mb-6">You ran out of chances.</p>
                                    <div className="flex flex-col gap-2 w-full max-w-xs">
                                        <div className="bg-white/10 p-4 rounded-xl mb-4">
                                            <span className="block text-xs uppercase text-purple-400">Final Score</span>
                                            <span className="text-2xl font-black text-white">{score}</span>
                                        </div>
                                        <button
                                            onClick={() => startGame(difficulty)}
                                            className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-full font-bold transition-colors w-full"
                                        >
                                            Try Again
                                        </button>
                                        <button
                                            onClick={resetGame}
                                            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-bold transition-colors w-full"
                                        >
                                            Main Menu
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Grid */}
            <div
                className="grid gap-2 flex-1 w-full max-w-sm mx-auto content-start"
                style={{ gridTemplateColumns: `repeat(${getGridCols()}, 1fr)` }}
            >
                {cards.map((card) => (
                    <motion.div
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className={`aspect-square relative cursor-pointer ${phase !== "recall" || selectedIds.includes(card.id) || card.isMatched ? "pointer-events-none" : ""
                            }`}
                        style={{ perspective: "1000px" }}
                        animate={{ scale: selectedIds.includes(card.id) ? 0.95 : 1 }}
                    >
                        <motion.div
                            className="w-full h-full relative transition-all duration-500"
                            style={{ transformStyle: "preserve-3d" }}
                            animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Back (Hidden) */}
                            <div
                                className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-700 to-indigo-800 border-2 border-purple-500/30 shadow-lg flex items-center justify-center"
                                style={{ backfaceVisibility: "hidden" }}
                            >
                                <span className="text-xl opacity-20">?</span>
                            </div>

                            {/* Front (Visible) */}
                            <div
                                className={`absolute inset-0 rounded-xl flex items-center justify-center text-3xl shadow-lg border-2 ${card.isMatched
                                    ? "bg-green-500/20 border-green-500 opacity-50"
                                    : phase === "result" && selectedIds.includes(card.id) && !card.isMatched
                                        ? "bg-red-500/20 border-red-500"
                                        : "bg-purple-900 border-purple-400"
                                    }`}
                                style={{
                                    backfaceVisibility: "hidden",
                                    transform: "rotateY(180deg)"
                                }}
                            >
                                {card.emoji}
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>

        </div>
    );
};
