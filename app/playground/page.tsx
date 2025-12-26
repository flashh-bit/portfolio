"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
    FlaskConical, ArrowLeft, Zap, Target, Brain,
    Palette, ChevronDown, Maximize2, X, Coffee,
    Fish, Globe
} from "lucide-react";

// Dynamic imports for performance
const ReactionTest = dynamic(() => import("@/components/experiments/ReactionTest").then(m => m.ReactionTest));
const AimTrainer = dynamic(() => import("@/components/experiments/AimTrainer").then(m => m.AimTrainer));
const MemoryGame = dynamic(() => import("@/components/experiments/MemoryGame").then(m => m.MemoryGame));
const PixelArt = dynamic(() => import("@/components/experiments/PixelArt").then(m => m.PixelArt));
const FishTank = dynamic(() => import("@/components/experiments/FishTank").then(m => m.FishTank));
const OrbitMeditation = dynamic(() => import("@/components/experiments/OrbitMeditation").then(m => m.OrbitMeditation));

const EXPERIMENTS = [
    {
        id: 1,
        title: "Reaction Test",
        description: "Test your reflex speed.",
        icon: <Zap className="w-6 h-6 text-white" />,
        color: "from-emerald-500 to-green-600",
        shadow: "shadow-emerald-500/20",
        component: <ReactionTest />,
    },
    {
        id: 2,
        title: "Aim Trainer",
        description: "Hit targets fast!",
        icon: <Target className="w-6 h-6 text-white" />,
        color: "from-red-500 to-rose-600",
        shadow: "shadow-red-500/20",
        component: <AimTrainer />,
    },
    {
        id: 3,
        title: "Memory Game",
        description: "Memorize & recall.",
        icon: <Brain className="w-6 h-6 text-white" />,
        color: "from-violet-500 to-purple-600",
        shadow: "shadow-violet-500/20",
        component: <MemoryGame />,
    },
    {
        id: 4,
        title: "Pixel Art",
        description: "Draw & relax.",
        icon: <Palette className="w-6 h-6 text-white" />,
        color: "from-pink-500 to-rose-500",
        shadow: "shadow-pink-500/20",
        component: <PixelArt />,
    },
    {
        id: 6,
        title: "Fish Tank",
        description: "Tap to feed the fish.",
        icon: <Fish className="w-6 h-6 text-white" />,
        color: "from-cyan-500 to-blue-600",
        shadow: "shadow-cyan-500/20",
        component: <FishTank />,
    },
    {
        id: 8,
        title: "Orbit Meditation",
        description: "Watch planets orbit.",
        icon: <Globe className="w-6 h-6 text-white" />,
        color: "from-indigo-500 to-purple-600",
        shadow: "shadow-indigo-500/20",
        component: <OrbitMeditation />,
    },
];

export default function PlaygroundPage() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12">
                    <div className="p-4 bg-neutral-900 rounded-3xl border border-neutral-800 w-fit">
                        <FlaskConical className="w-10 h-10 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                            Experiment Lab
                        </h1>
                        <p className="text-neutral-400 text-lg max-w-xl">
                            Select a game cartridge to <span className="text-cyan-400 font-bold">plug in & play</span>.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
                    {EXPERIMENTS.map((ex) => {
                        const isSelected = selectedId === ex.id;

                        return (
                            <motion.div
                                layout
                                key={ex.id}
                                onClick={() => !isSelected && setSelectedId(ex.id)}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    gridColumn: isSelected ? "1 / -1" : "auto",
                                    gridRow: isSelected ? "span 1" : "auto"
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className={`
                  relative overflow-hidden rounded-3xl border cursor-pointer transition-all
                  ${isSelected
                                        ? "bg-neutral-900 border-neutral-700 ring-2 ring-cyan-500/50 shadow-2xl z-10"
                                        : "bg-neutral-900/50 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 hover:scale-[1.02]"
                                    }
                `}
                            >
                                <div className={`p-6 flex items-center justify-between ${isSelected ? "border-b border-neutral-800" : ""}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${ex.color} shadow-lg ${ex.shadow}`}>
                                            {ex.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-xl">{ex.title}</h3>
                                            {!isSelected && (
                                                <p className="text-neutral-500 text-sm hidden sm:block">
                                                    {ex.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedId(isSelected ? null : ex.id);
                                        }}
                                        className={`p-3 rounded-full transition-colors ${isSelected
                                            ? "bg-neutral-800 text-white hover:bg-neutral-700"
                                            : "bg-white text-black hover:bg-neutral-200"
                                            }`}
                                    >
                                        {isSelected ? <X size={20} /> : <Maximize2 size={20} />}
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 md:p-6 bg-black/20">
                                                {ex.component}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
