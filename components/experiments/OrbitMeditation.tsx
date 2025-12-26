"use client";

import { useState, useCallback } from "react";
import { Gauge, Play, Pause, Maximize2, Minimize2 } from "lucide-react";
import SolarSystemScene from "./SolarSystem/Scene";
import { SOLAR_SYSTEM_DATA } from "../../data/solarSystemData";
import { motion, AnimatePresence } from "framer-motion";

export const OrbitMeditation = () => {
    // State
    const [timeScale, setTimeScale] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const [scaleMode, setScaleMode] = useState<'real' | 'visual'>('visual');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selectedBody = SOLAR_SYSTEM_DATA.find(b => b.id === selectedId);

    return (
        <div className="relative w-full h-[800px] bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">

            {/* 3D SCENE LAYER */}
            <div className="absolute inset-0 z-0">
                <SolarSystemScene
                    timeScale={timeScale}
                    isPaused={isPaused}
                    scaleMode={scaleMode}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                />
            </div>

            {/* HUD LAYER (Pointer events none by default, auto on interactables) */}
            <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">

                {/* TOP HEADER */}
                <div className="flex justify-between items-start pointer-events-auto">
                    <div>
                        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 tracking-tighter">
                            SOLAR ZEN
                        </h1>
                        <p className="text-xs font-mono text-cyan-200/50 mt-1 uppercase tracking-widest">
                            Interactive Orrery // {scaleMode === 'visual' ? 'VISUAL MODE' : 'REAL SCALE'}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setScaleMode(m => m === 'visual' ? 'real' : 'visual')}
                            className="bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-lg text-xs font-mono text-white/70 hover:bg-white/10 transition-colors"
                        >
                            {scaleMode === 'visual' ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                            <span className="sr-only">Toggle Scale</span>
                        </button>
                    </div>
                </div>

                {/* BOTTOM CONTROLS */}
                <div className="flex items-end gap-6 pointer-events-auto">

                    {/* Time Controls */}
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col gap-3 min-w-[200px]">
                        <div className="flex justify-between text-xs text-white/50 font-mono uppercase">
                            <span className="flex items-center gap-1"><Gauge size={12} /> Time Dilation</span>
                            <span className="text-cyan-400">{timeScale.toFixed(1)}x</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="5" step="0.1"
                            value={timeScale}
                            onChange={(e) => setTimeScale(parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-cyan-400"
                        />
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg flex justify-center items-center gap-2 text-xs font-bold text-white transition-all"
                        >
                            {isPaused ? <Play size={14} /> : <Pause size={14} />}
                            {isPaused ? "RESUME SIMULATION" : "PAUSE TIME"}
                        </button>
                    </div>

                    {/* Planet Picker Carousel */}
                    <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-fade-right">
                        {SOLAR_SYSTEM_DATA.filter(p => p.id !== 'sun').map(planet => (
                            <button
                                key={planet.id}
                                onClick={() => setSelectedId(planet.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all min-w-[140px]
                                    ${selectedId === planet.id
                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-white'
                                        : 'bg-black/40 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}
                                `}
                            >
                                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: planet.color }} />
                                <span className="font-bold text-sm">{planet.name}</span>
                            </button>
                        ))}
                    </div>

                </div>
            </div>

            {/* INFO PANEL (Animate Presence) */}
            <AnimatePresence>
                {selectedBody && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="absolute top-24 right-6 w-80 pointer-events-auto z-20"
                    >
                        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-3xl font-black text-white">{selectedBody.name}</h2>
                                    <p className="text-xs text-cyan-400 font-mono uppercase tracking-widest">{selectedBody.type}</p>
                                </div>
                                <button onClick={() => setSelectedId(null)} className="text-white/30 hover:text-white">
                                    <Minimize2 size={16} />
                                </button>
                            </div>

                            <p className="text-sm text-white/70 leading-relaxed mb-6 border-l-2 border-cyan-500/30 pl-3">
                                {selectedBody.description}
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <StatItem label="Orbital Period" value="-- days" />
                                <StatItem label="Distance" value={`${selectedBody.orbit.a} AU`} />
                                <StatItem label="Radius" value={`${selectedBody.radius} x Earth`} />
                                <StatItem label="Excentricity" value={selectedBody.orbit.e.toString()} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

const StatItem = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-white/5 rounded-lg p-3">
        <div className="text-[10px] text-white/30 uppercase font-bold mb-1">{label}</div>
        <div className="text-sm font-mono text-cyan-100">{value}</div>
    </div>
);
