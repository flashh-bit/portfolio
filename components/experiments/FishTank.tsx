"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Plus, Trash2, Thermometer } from "lucide-react";

interface FishData {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    tailColor: string;
    speed: number;
    direction: 1 | -1;
    type: "goldfish" | "betta" | "neon" | "angelfish";
    wobbleOffset: number;
    depth: number;
}

interface BubbleData {
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    wobble: number;
}

interface FoodParticle {
    id: number;
    x: number;
    y: number;
    rotation: number;
}

const FISH_PRESETS = {
    goldfish: { color: "#FF6B35", tailColor: "#FF8C5A", size: 28 },
    betta: { color: "#9B59B6", tailColor: "#E74C3C", size: 32 },
    neon: { color: "#00D4FF", tailColor: "#00FF88", size: 18 },
    angelfish: { color: "#F1C40F", tailColor: "#E67E22", size: 35 },
};

export const FishTank = () => {
    // State for React Rendering (Adding/Removing items)
    const [fishCount, setFishCount] = useState(0); // Trigger re-renders when count changes
    const [food, setFood] = useState<FoodParticle[]>([]);
    const [isNightMode, setIsNightMode] = useState(false);
    const [temp, setTemp] = useState(24);

    // Refs for Physics Engine (High Performance, No Re-renders)
    const fishRef = useRef<FishData[]>([]);
    const bubblesRef = useRef<BubbleData[]>([]);
    const requestRef = useRef<number>(0);

    // Initialize Ref Data
    useEffect(() => {
        const types: FishData["type"][] = ["goldfish", "betta", "neon", "angelfish"];
        // Initial population
        fishRef.current = Array.from({ length: 5 }).map((_, i) => createFish(types[i % 4]));
        setFishCount(5);

        bubblesRef.current = Array.from({ length: 15 }).map(createBubble);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    const createFish = (type: FishData["type"]): FishData => {
        const preset = FISH_PRESETS[type];
        return {
            id: Date.now() + Math.random(),
            x: 10 + Math.random() * 80,
            y: 20 + Math.random() * 60,
            size: preset.size + Math.random() * 8,
            color: preset.color,
            tailColor: preset.tailColor,
            speed: 0.5 + Math.random() * 1.5,
            direction: Math.random() > 0.5 ? 1 : -1,
            type,
            wobbleOffset: Math.random() * Math.PI * 2,
            depth: 0.4 + Math.random() * 0.6,
        };
    };

    function createBubble(): BubbleData {
        return {
            id: Date.now() + Math.random(),
            x: 15 + Math.random() * 5,
            y: 100 + Math.random() * 50, // Start below or randomly
            size: 2 + Math.random() * 4,
            speed: 0.5 + Math.random() * 1.5,
            wobble: Math.random() * Math.PI,
        };
    }

    // --- THE GAME LOOP (Direct DOM Manipulation) ---
    const updatePhysics = useCallback(() => {
        const time = Date.now() / 1000;

        // 1. Update Fish
        fishRef.current.forEach(fish => {
            // Logic
            let newX = fish.x + fish.direction * fish.speed * 0.1;
            if (Math.random() < 0.005) fish.direction *= -1;
            if (Math.random() < 0.01) fish.speed = 0.5 + Math.random() * 1.5;

            if (newX <= 5 || newX >= 95) {
                fish.direction *= -1;
                newX = Math.max(5, Math.min(95, newX));
            }

            let newY = fish.y + Math.sin(time + fish.wobbleOffset) * 0.1;
            newY = Math.max(15, Math.min(85, newY));

            fish.x = newX;
            fish.y = newY;

            // Direct DOM Update
            const el = document.getElementById(`fish-${fish.id}`);
            if (el) {
                // Using transform for GPU acceleration
                el.style.transform = `translate(${newX}cqw, ${newY}cqh) scaleX(${fish.direction * -1}) scale(${0.5 + fish.depth * 0.5})`;
                // Blur/Z-index is set in render, but we could update it here if depth changed dynamically
            }
        });

        // 2. Update Bubbles
        bubblesRef.current.forEach((bubble, index) => {
            bubble.y -= bubble.speed * 0.5;
            bubble.x += Math.sin(time * 2 + bubble.wobble) * 0.1;

            if (bubble.y < -10) {
                // Reset bubble to bottom
                Object.assign(bubble, createBubble());
                bubble.y = 110;
            }

            const el = document.getElementById(`bubble-${index}`);
            if (el) {
                el.style.left = `${bubble.x}%`;
                el.style.top = `${bubble.y}%`;
            }
        });

        requestRef.current = requestAnimationFrame(updatePhysics);
    }, []);

    // Start Loop
    useEffect(() => {
        requestRef.current = requestAnimationFrame(updatePhysics);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [updatePhysics]);


    // Handlers
    const addFish = (type: FishData["type"]) => {
        if (fishRef.current.length >= 20) return;
        const newFish = createFish(type);
        fishRef.current.push(newFish);
        setFishCount(c => c + 1); // Trigger render to add element to DOM
    };

    const clearTank = () => {
        fishRef.current = [];
        setFishCount(0);
    };

    const handleFeed = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setFood(prev => [...prev, { id: Date.now(), x, y: Math.min(y, 10), rotation: Math.random() * 360 }]);
    }, []);

    // Memoize static background essentials to avoid reflows
    const TankBackground = useMemo(() => (
        <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Background gradient handled by parent state prop */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rocky-wall.png')] opacity-20 mix-blend-overlay" />

            {/* Heater */}
            <div className="absolute top-10 right-10 w-4 h-64 bg-neutral-800/80 rounded-full border border-neutral-700 blur-[1px]">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-red-500 rounded-full shadow-[0_0_10px_red]" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Filter */}
            <div className="absolute top-0 left-16 w-6 h-full bg-neutral-900/60 blur-[2px]">
                <div className="absolute bottom-10 w-8 h-12 -left-1 bg-neutral-800 rounded-lg flex flex-col gap-1 p-1">
                    {Array.from({ length: 6 }).map((_, i) => <div key={i} className="w-full h-1 bg-black/50" />)}
                </div>
            </div>

            {/* Decor */}
            <div className="absolute bottom-0 inset-x-0 h-16 bg-[#3d342b]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')] opacity-60 mix-blend-multiply" />
                <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-black/60 to-transparent" />
            </div>

            <div className="absolute bottom-8 right-1/4 w-32 h-20 bg-neutral-700 rounded-[40%_60%_70%_30%] shadow-xl" />

            {/* Plants */}
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute bottom-10 w-2 bg-gradient-to-t from-green-800 to-green-500 rounded-t-full origin-bottom opacity-90 animate-sway"
                    style={{
                        left: `${10 + i * 10 + (i > 3 ? 20 : 0)}%`,
                        height: `${100 + Math.random() * 100}px`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${3 + i}s`
                    }}
                />
            ))}
        </div>
    ), []);

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto p-8 bg-neutral-900 rounded-3xl">
            <style jsx global>{`
                @keyframes sway {
                    0%, 100% { transform: rotate(-5deg); }
                    50% { transform: rotate(5deg); }
                }
                .animate-sway {
                    animation: sway 4s ease-in-out infinite;
                }
            `}</style>

            {/* TANK CONTAINER */}
            <div className="relative w-full aspect-[16/9] perspective-1000 group">
                <div className="absolute -inset-4 bg-[#1a1a1a] rounded-xl border-t-4 border-[#333] shadow-2xl z-0" />

                <div
                    onClick={handleFeed}
                    className="relative w-full h-full bg-[#121c26] overflow-hidden cursor-crosshair z-10 shadow-inner rounded-sm border-[1px] border-white/5"
                    style={{
                        containerType: 'size', // Enable Container Queries for cqw/cqh units
                        boxShadow: isNightMode
                            ? "inset 0 0 100px rgba(0,0,0,0.9)"
                            : "inset 0 0 60px rgba(0,0,20,0.4)",
                    }}
                >
                    {/* Background Layer */}
                    <div className={`absolute inset-0 transition-colors duration-2000 ${isNightMode ? 'bg-[#050810]' : 'bg-gradient-to-b from-[#1a3b5c] to-[#0f2438]'}`} />
                    {TankBackground}

                    {/* BUBBLES (Rendered via DOM Loop) */}
                    {bubblesRef.current.map((b, i) => (
                        <div
                            key={`bubble-${i}`}
                            id={`bubble-${i}`}
                            className="absolute rounded-full bg-white/20 shadow-[inset_-1px_-1px_2px_rgba(255,255,255,0.3)] backdrop-blur-[1px] pointer-events-none"
                            style={{
                                left: `${b.x}%`,
                                top: '110%', // Initial offscreen
                                width: b.size,
                                height: b.size,
                                transition: 'none' // Crucial for loop performance
                            }}
                        />
                    ))}

                    {/* FISH (Rendered via DOM Loop) */}
                    {fishRef.current.map(fish => (
                        <div
                            key={fish.id}
                            id={`fish-${fish.id}`}
                            className="absolute left-0 top-0 pointer-events-none will-change-transform"
                            style={{
                                zIndex: Math.floor(fish.depth * 10),
                                filter: `blur(${(1 - fish.depth) * 2}px) brightness(${0.7 + fish.depth * 0.3})`,
                                // Initial transform is set by loop immediately
                            }}
                        >
                            <div className="relative -translate-x-1/2 -translate-y-1/2">
                                <svg width={fish.size * 2} height={fish.size} viewBox="0 0 60 30" style={{ overflow: 'visible' }}>
                                    {/* Fish Body & Animations */}
                                    <g>
                                        <motion.path
                                            d="M45,15 Q55,5 60,8 L60,22 Q55,25 45,15"
                                            fill={fish.tailColor}
                                            animate={{
                                                d: [
                                                    "M42,15 Q55,0 60,5 L60,25 Q55,30 42,15",
                                                    "M42,15 Q55,10 60,15 L60,15 Q55,20 42,15",
                                                    "M42,15 Q55,0 60,5 L60,25 Q55,30 42,15"
                                                ]
                                            }}
                                            transition={{ duration: 0.2 + Math.random() * 0.3, repeat: Infinity, ease: "linear" }}
                                        />
                                        <path d="M20,5 Q25,-5 35,5" fill={fish.tailColor} opacity="0.8" />
                                        <path d="M25,25 Q30,35 40,25" fill={fish.tailColor} opacity="0.8" />
                                        <ellipse cx="25" cy="15" rx="20" ry="12" fill={fish.color} />
                                        <ellipse cx="25" cy="12" rx="15" ry="6" fill="white" opacity="0.2" />
                                        <circle cx="12" cy="13" r="3.5" fill="white" />
                                        <circle cx="12" cy="13" r="1.5" fill="black" />
                                    </g>
                                </svg>
                            </div>
                        </div>
                    ))}

                    {/* FOOD PARTICLES (React State is fine for temporary items) */}
                    <AnimatePresence>
                        {food.map(f => (
                            <motion.div
                                key={f.id}
                                className="absolute w-1.5 h-1.5 bg-[#8b4513] rounded-sm z-50"
                                style={{ left: `${f.x}%`, top: `${f.y}%` }}
                                animate={{ top: "95%", rotate: 360 }}
                                transition={{ duration: 6, ease: "linear" }}
                                onAnimationComplete={() => setFood(prev => prev.filter(item => item.id !== f.id))}
                            />
                        ))}
                    </AnimatePresence>

                    {/* FOREGROUND OVERLAYS */}
                    <div className="absolute inset-0 z-30 pointer-events-none">
                        <div className="absolute top-4 inset-x-0 h-1 bg-white/20 blur-[1px]">
                            <div className="absolute inset-0 bg-white/30 animate-pulse" />
                        </div>
                        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
                        <div className="absolute top-20 left-40 w-20 h-px bg-white/10 -rotate-12" />
                    </div>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="w-full bg-[#1a1a1a] p-4 rounded-xl border-t border-[#333] flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4 bg-black/50 px-4 py-2 rounded-lg border border-[#333]">
                    <div className="text-right">
                        <div className={`text-xs font-mono uppercase ${isNightMode ? 'text-blue-400' : 'text-green-400'}`}>
                            {isNightMode ? 'MOONLIGHT' : 'DAYLIGHT'}
                        </div>
                        <div className="text-xl font-bold font-mono text-white flex items-center gap-2">
                            <Thermometer size={16} className="text-red-500" /> {temp.toFixed(1)}°C
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {(['goldfish', 'betta', 'neon', 'angelfish'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => addFish(type)}
                            disabled={fishCount >= 20}
                            className={`
                                w-10 h-10 rounded-full border-2 border-[#333] flex items-center justify-center transition-all hover:scale-110 active:scale-95
                                ${fishCount >= 20 ? 'opacity-30 cursor-not-allowed' : 'hover:border-white/50'}
                            `}
                            style={{ background: FISH_PRESETS[type].color }}
                        >
                            <Plus size={16} className="text-black/50" />
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsNightMode(!isNightMode)} className={`p-3 rounded-lg border border-[#333] transition-colors ${isNightMode ? 'bg-blue-900/30 text-blue-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                        {isNightMode ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <button onClick={clearTank} className="p-3 rounded-lg border border-[#333] bg-red-900/20 text-red-500 hover:bg-red-900/40 transition-colors">
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};


