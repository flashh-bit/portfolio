"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, FlaskConical } from 'lucide-react';
import { Experiment } from '@/app/data/portfolio';

interface ExperimentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    experiments: Experiment[];
}

const ExperimentsModal = ({ isOpen, onClose, experiments }: ExperimentsModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 md:top-10 md:bottom-10 md:left-[20%] md:right-[20%] z-50 bg-[#0a0f0f] border-t md:border border-cyan-900/50 rounded-t-3xl md:rounded-3xl overflow-y-auto shadow-2xl scrollbar-hide"
                    >
                        <div className="flex justify-between items-center sticky top-0 bg-[#0a0f0f] p-6 border-b border-cyan-900/30 z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-cyan-500/10 rounded-full">
                                    <FlaskConical className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Experiments Lab</h2>
                                    <p className="text-cyan-400/70 text-sm">Small ideas & creative explorations</p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2 bg-cyan-900/30 rounded-full hover:bg-cyan-800/50 transition-colors"
                            >
                                <X className="w-5 h-5 text-cyan-400" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 pt-4 pb-10">
                            {experiments.map((experiment, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative bg-[#0d1414] border border-cyan-900/30 rounded-2xl p-5 hover:border-cyan-500/50 hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)] transition-all"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/10 text-cyan-300 rounded-full uppercase tracking-wider">
                                            Experiment
                                        </span>
                                        {experiment.link && (
                                            <a href={experiment.link} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-4 h-4 text-cyan-600 hover:text-cyan-400 transition-colors" />
                                            </a>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{experiment.title}</h3>
                                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">{experiment.description}</p>

                                    <div className="flex flex-wrap gap-2">
                                        {experiment.tags.map((tag) => (
                                            <span key={tag} className="text-xs text-cyan-500/80 bg-cyan-950/50 px-2 py-1 rounded-md border border-cyan-900/50">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ExperimentsModal;
