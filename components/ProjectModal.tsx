import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';
import { Project } from '@/app/data/portfolio';

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    projects: Project[];
}

const ProjectModal = ({ isOpen, onClose, projects }: ProjectModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop (Backdrop blur + dim) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
                    />

                    {/* Modal Content - Slide up from bottom */}
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 md:top-10 md:bottom-10 md:left-[20%] md:right-[20%] z-50 bg-[#121212] border-t md:border border-[#262626] rounded-t-3xl md:rounded-3xl overflow-y-auto shadow-2xl scrollbar-hide"
                    >
                        <div className="flex justify-between items-center sticky top-0 bg-[#121212] p-6 border-b border-[#262626] z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Selected Works</h2>
                                <p className="text-gray-400 text-sm">A collection of my recent projects</p>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2 bg-[#262626] rounded-full hover:bg-neutral-800 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4 p-6 pt-2 pb-10">
                            {projects.map((project, index) => (
                                <div key={index} className="group relative bg-[#171717] border border-[#262626] rounded-2xl p-5 hover:border-neutral-700 transition-all flex flex-col md:flex-row gap-4">

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/10 text-purple-300 rounded-full uppercase tracking-wider">
                                                Project
                                            </span>
                                            <div className="flex gap-2">
                                                {/* If you have a github property in your type, you can conditionally render it here */}
                                                {/* <Github className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer" /> */}
                                                {project.link && (
                                                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                        <p className="text-sm text-gray-400 mb-4 leading-relaxed">{project.description}</p>

                                        <div className="flex flex-wrap gap-2">
                                            {project.tech.map((t) => (
                                                <span key={t} className="text-xs text-gray-500 bg-[#0a0a0a] px-2 py-1 rounded-md border border-[#262626]">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProjectModal;
