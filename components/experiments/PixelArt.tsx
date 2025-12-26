"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eraser, Download, RotateCcw, Palette, PaintBucket, Undo, Check } from "lucide-react";

// Robust Palette System
const PALETTES = {
    "Vibrant": [
        "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
        "#FFFF00", "#FF00FF", "#00FFFF", "#FF8800", "#8800FF",
        "#FF0088", "#00FF88", "#0088FF", "#88FF00", "#555555", "#AAAAAA"
    ],
    "Shades": [
        "#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF",
        "#330000", "#660000", "#990000", "#CC0000", "#FF0000", "#FF6666",
        "#003300", "#006600", "#009900", "#00CC00", "#00FF00", "#66FF66",
        "#000033", "#000066", "#000099", "#0000CC", "#0000FF", "#6666FF",
        "#331900", "#663300", "#994C00", "#CC6600", "#FF8000", "#FFB366",
    ],
    "Pastel": [
        "#000000", "#FFFFFF", "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9",
        "#BAE1FF", "#E6E6FA", "#D8BFD8", "#FFD1DC", "#FFF0F5", "#E0FFFF",
        "#98FB98", "#DDA0DD", "#F0E68C", "#FF6961"
    ],
    "Retro": [
        "#0f380f", "#306230", "#8bac0f", "#9bbc0f",
        "#000000", "#FFFFFF", "#204631", "#527F39"
    ],
    "Pico-8": [
        "#000000", "#1D2B53", "#7E2553", "#008751", "#AB5236", "#5F574F",
        "#C2C3C7", "#FFF1E8", "#FF004D", "#FFA300", "#FFEC27", "#00E436",
        "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA"
    ],
    "Neon": [
        "#000000", "#FFFFFF", "#FE0000", "#FD00FF", "#8F00FF", "#001EFF",
        "#00CCFF", "#00FF00", "#CCFF00", "#FFFF00", "#FF7B00", "#FF007C"
    ]
};

const GRID_SIZES = [12, 16, 24, 32];
type PaletteName = keyof typeof PALETTES;

export const PixelArt = () => {
    const [gridSize, setGridSize] = useState(16);
    const [pixels, setPixels] = useState<string[][]>([]);
    const [history, setHistory] = useState<string[][][]>([]);
    const [currentColor, setCurrentColor] = useState("#FFFFFF");
    const [tool, setTool] = useState<"pencil" | "eraser" | "fill">("pencil");
    const [currentPalette, setCurrentPalette] = useState<PaletteName>("Vibrant");
    const [isDrawing, setIsDrawing] = useState(false);

    // Initialize grid
    useEffect(() => {
        resetGrid(gridSize);
    }, [gridSize]);

    const resetGrid = (size: number) => {
        const newGrid = Array(size).fill(null).map(() => Array(size).fill("#1a1a1a"));
        setPixels(newGrid);
        setHistory([newGrid]); // Reset history
    };

    const addToHistory = (newGrid: string[][]) => {
        const newHistory = [...history, newGrid];
        if (newHistory.length > 20) newHistory.shift();
        setHistory(newHistory);
        setPixels(newGrid);
    };

    const handleUndo = () => {
        if (history.length <= 1) return;
        const newHistory = [...history];
        newHistory.pop();
        setHistory(newHistory);
        setPixels(newHistory[newHistory.length - 1]);
    };

    const handlePixelClick = (row: number, col: number) => {
        if (tool === "fill") {
            const targetColor = pixels[row][col];
            const fillColor = currentColor;
            if (targetColor === fillColor) return;

            const newGrid = pixels.map(r => [...r]);
            floodFill(newGrid, row, col, targetColor, fillColor);
            addToHistory(newGrid);
            return;
        }

        const newGrid = pixels.map(r => [...r]);
        const drawColor = tool === "eraser" ? "#1a1a1a" : currentColor;

        if (newGrid[row][col] === drawColor) return;

        newGrid[row][col] = drawColor;
        addToHistory(newGrid);
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (isDrawing && tool !== "fill") {
            const newGrid = pixels.map(r => [...r]);
            const drawColor = tool === "eraser" ? "#1a1a1a" : currentColor;
            if (newGrid[row][col] !== drawColor) {
                newGrid[row][col] = drawColor;
                setPixels(newGrid);
            }
        }
    };

    // Add history snapshot on drag end
    const handleMouseUp = () => {
        if (isDrawing) {
            setIsDrawing(false);
            if (JSON.stringify(pixels) !== JSON.stringify(history[history.length - 1])) {
                addToHistory(pixels);
            }
        }
    };

    const floodFill = (grid: string[][], r: number, c: number, target: string, replacement: string) => {
        if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return;
        if (grid[r][c] !== target) return;

        grid[r][c] = replacement;

        floodFill(grid, r + 1, c, target, replacement);
        floodFill(grid, r - 1, c, target, replacement);
        floodFill(grid, r, c + 1, target, replacement);
        floodFill(grid, r, c - 1, target, replacement);
    };

    const downloadImage = () => {
        const canvas = document.createElement("canvas");
        const scale = 20;
        canvas.width = gridSize * scale;
        canvas.height = gridSize * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        pixels.forEach((row, rowIndex) => {
            row.forEach((color, colIndex) => {
                ctx.fillStyle = color;
                ctx.fillRect(colIndex * scale, rowIndex * scale, scale, scale);
            });
        });

        const link = document.createElement("a");
        link.download = `pixel-art-${gridSize}x${gridSize}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className="w-full h-full min-h-[500px] bg-neutral-950 rounded-2xl p-4 flex flex-col gap-4 relative">
            {/* Header Controls */}
            <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-pink-400" />
                    <h3 className="text-white font-bold hidden sm:block">Pixel Art</h3>

                    {/* Grid Size Selector */}
                    <div className="flex bg-neutral-800 rounded-lg p-1 ml-2">
                        {GRID_SIZES.map(size => (
                            <button
                                key={size}
                                onClick={() => setGridSize(size)}
                                className={`px-2 py-1 text-xs rounded-md transition-all ${gridSize === size
                                    ? "bg-neutral-600 text-white font-bold shadow-sm"
                                    : "text-neutral-400 hover:text-white"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleUndo}
                        disabled={history.length <= 1}
                        className="p-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:hover:bg-neutral-800 rounded-lg transition-colors"
                        title="Undo"
                    >
                        <Undo className="w-4 h-4 text-neutral-300" />
                    </button>
                    <button
                        onClick={() => resetGrid(gridSize)}
                        className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                        title="Clear"
                    >
                        <RotateCcw className="w-4 h-4 text-neutral-400" />
                    </button>
                    <button
                        onClick={downloadImage}
                        className="p-2 bg-pink-500/20 hover:bg-pink-500/40 rounded-lg transition-colors"
                        title="Download"
                    >
                        <Download className="w-4 h-4 text-pink-400" />
                    </button>
                </div>
            </div>

            {/* Tools */}
            <div className="flex gap-2 bg-neutral-900/50 p-2 rounded-xl border border-neutral-800">
                <button
                    onClick={() => setTool("pencil")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${tool === "pencil" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "hover:bg-neutral-800 text-neutral-400"
                        }`}
                >
                    <Check className="w-4 h-4" /> Draw
                </button>
                <button
                    onClick={() => setTool("fill")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${tool === "fill" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "hover:bg-neutral-800 text-neutral-400"
                        }`}
                >
                    <PaintBucket className="w-4 h-4" /> Fill
                </button>
                <button
                    onClick={() => setTool("eraser")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${tool === "eraser" ? "bg-neutral-700 text-white" : "hover:bg-neutral-800 text-neutral-400"
                        }`}
                >
                    <Eraser className="w-4 h-4" /> Erase
                </button>
            </div>

            {/* Palette Tabs (Horizontal Scroll) */}
            <div className="w-full overflow-x-auto pb-2 scrollbar-none">
                <div className="flex gap-2 w-max px-1">
                    {(Object.keys(PALETTES) as PaletteName[]).map(name => (
                        <button
                            key={name}
                            onClick={() => setCurrentPalette(name)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${currentPalette === name
                                    ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105"
                                    : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300"
                                }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${currentPalette === name ? "ring-1 ring-black/20" : ""}`} style={{ backgroundColor: PALETTES[name][2] }} />
                            {name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Swatches */}
            <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-800 shadow-inner">
                <div className="flex flex-wrap gap-2 justify-center max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent p-1">
                    {PALETTES[currentPalette].map((color) => (
                        <button
                            key={color}
                            onClick={() => {
                                setCurrentColor(color);
                                if (tool === "eraser") setTool("pencil");
                            }}
                            className={`w-9 h-9 rounded-lg transition-transform hover:scale-110 hover:z-10 shadow-sm ${currentColor === color && tool !== "eraser"
                                    ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-900 scale-110 z-10"
                                    : "hover:ring-2 hover:ring-white/20 hover:ring-offset-1 hover:ring-offset-neutral-900"
                                }`}
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                    ))}
                </div>
            </div>

            {/* Grid Container */}
            <div className="flex-1 min-h-[300px] bg-neutral-900/30 rounded-xl border border-neutral-800 flex items-center justify-center p-4 overflow-hidden">
                <div
                    className="grid gap-[1px] bg-neutral-800 shadow-2xl"
                    style={{
                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                        width: 'min(100%, 400px)',
                        aspectRatio: '1/1'
                    }}
                    onMouseLeave={handleMouseUp}
                    onMouseUp={handleMouseUp}
                >
                    {pixels.map((row, rowIndex) =>
                        row.map((color, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className="w-full h-full cursor-crosshair transition-colors duration-100"
                                style={{ backgroundColor: color }}
                                onMouseDown={() => {
                                    setIsDrawing(true);
                                    handlePixelClick(rowIndex, colIndex);
                                }}
                                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
