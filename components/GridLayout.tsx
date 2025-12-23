"use client";

import { BentoItem } from "./BentoItem";
import { portfolioData } from "@/app/data/portfolio";
import { Github, Twitter, Instagram, Mail, MapPin, Music, Code2, ArrowUpRight, FolderOpen } from "lucide-react";
import { SpotifyCard } from "./SpotifyCard";
import ProjectModal from "./ProjectModal";
import { useState } from "react";

export const GridLayout = () => {
    const { name, greeting, role, bio, location, avatarUrl, techStack, socials, spotify, projects } = portfolioData;
    const [isProjectOpen, setIsProjectOpen] = useState(false);

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-8 max-w-6xl mx-auto auto-rows-[180px] md:auto-rows-[250px]">

            {/* Item 1: Profile & Bio - Big prominent block */}

            <BentoItem className="col-span-2 md:col-span-2 lg:col-span-2 row-span-2 p-0 flex flex-col justify-between bg-neutral-900 overflow-hidden relative group">

                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={avatarUrl}
                        alt={name}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Strong gradient overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                </div>

                {/* Content Container */}
                <div className="flex flex-col h-full justify-between p-6 md:p-10 z-10 relative">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter drop-shadow-lg">
                            <span className="text-2xl md:text-4xl font-bold text-purple-300 mr-4 align-baseline">{greeting}</span>
                            {name}
                        </h1>
                        <p className="text-xl md:text-2xl text-purple-200 font-medium mb-6 drop-shadow-md">{role}</p>
                    </div>
                    <div className="mt-auto max-w-lg">
                        <p className="text-neutral-200 text-base md:text-lg leading-relaxed mb-6 font-medium drop-shadow-md">{bio}</p>
                        <div className="flex gap-3 items-center bg-black/30 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs md:text-sm text-white uppercase tracking-wider font-bold">Available for work</span>
                        </div>
                    </div>
                </div>
            </BentoItem>

            {/* Item 2: Map/Location */}
            <BentoItem className="col-span-1 flex flex-col items-center justify-center p-6 relative group overflow-hidden">
                <div className="absolute inset-0 bg-neutral-800/50 group-hover:bg-neutral-800/30 transition-colors z-0" />
                <MapPin className="text-white w-10 h-10 mb-4 z-10" />
                <h3 className="text-white font-semibold z-10 text-xs md:text-lg">{location}</h3>
                <p className="text-neutral-500 text-xs z-10 mt-1 uppercase tracking-wide">Based In</p>
                {/* stylized map background hint */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-700 to-transparent" />
            </BentoItem>

            {/* Item 3: Social Links */}
            <BentoItem className="col-span-1 p-6 flex flex-col justify-center gap-6">
                <div className="grid grid-cols-2 gap-4 h-full">
                    <a href={socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-neutral-800/50 rounded-2xl hover:bg-neutral-800 hover:text-white text-neutral-400 transition-colors">
                        <Github size={24} />
                    </a>
                    <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-neutral-800/50 rounded-2xl hover:bg-blue-500/20 hover:text-blue-400 text-neutral-400 transition-colors">
                        <Twitter size={24} />
                    </a>
                    <a href={socials.instagram} target="_blank" rel="_noopener noreferrer" className="flex items-center justify-center bg-neutral-800/50 rounded-2xl hover:bg-pink-600/20 hover:text-pink-500 text-neutral-400 transition-colors">
                        <Instagram size={24} />
                    </a>
                    <a href={socials.email} className="flex items-center justify-center bg-neutral-800/50 rounded-2xl hover:bg-emerald-500/20 hover:text-emerald-400 text-neutral-400 transition-colors">
                        <Mail size={24} />
                    </a>
                </div>
            </BentoItem>

            {/* Item 4: Tech Stack */}
            <BentoItem className="col-span-2 md:col-span-2 lg:col-span-1 p-5 flex flex-col overflow-y-auto scrollbar-hide">
                <div className="flex items-center gap-3 mb-4 text-neutral-300 shrink-0">
                    <Code2 size={20} />
                    <h3 className="font-bold">Tech Stack</h3>
                </div>
                <div className="flex flex-wrap gap-2 content-start">
                    {techStack.map((tech) => (
                        <span key={tech} className="px-3 py-1 text-xs md:text-sm bg-neutral-800 text-neutral-300 rounded-full border border-neutral-700/50">
                            {tech}
                        </span>
                    ))}
                </div>
            </BentoItem>

            {/* Item 5: Spotify/Status */}
            <SpotifyCard />

            {/* Project Showcase - All Projects */}
            {/* Item 6: Project Vault Trigger - Replaces the mapped list */}
            <div
                onClick={() => setIsProjectOpen(true)}
                className="col-span-1 md:col-span-1 bg-[#171717] border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between h-full cursor-pointer hover:border-purple-500/50 hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)] transition-all group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex justify-between items-start relative z-10">
                    <div className="p-3 bg-purple-500/10 rounded-full text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                        <FolderOpen className="w-6 h-6" />
                    </div>
                    <div className="bg-neutral-800 rounded-full p-2 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>

                <div className="relative z-10">
                    <h3 className="text-4xl font-bold text-white mb-1 group-hover:scale-110 origin-left transition-transform duration-300">{projects.length}</h3>
                    <p className="text-sm text-neutral-400 font-medium group-hover:text-purple-300 transition-colors">Selected Projects</p>
                    <p className="text-xs text-neutral-600 mt-2 group-hover:text-purple-400/70 transition-colors">Tap to view vault</p>
                </div>
            </div>

            <ProjectModal
                isOpen={isProjectOpen}
                onClose={() => setIsProjectOpen(false)}
                projects={projects}
            />

        </div>
    );
};
