"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Github, Twitter, Instagram, Mail, MapPin,
    Code2, ArrowUpRight, FolderOpen, FlaskConical, Send
} from "lucide-react";

import { portfolioData } from "@/app/data/portfolio";
import { BentoItem } from "./BentoItem";
import { SpotifyCard } from "./SpotifyCard";
import ProjectModal from "./ProjectModal";
import ContactModal from "./ContactModal";

export const GridLayout = () => {
    const { name, greeting, role, bio, location, avatarUrl, techStack, socials, projects } = portfolioData;
    const [isProjectOpen, setIsProjectOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-8 max-w-6xl mx-auto auto-rows-[180px] md:auto-rows-[250px]">

            {/* Profile & Bio */}
            <BentoItem className="col-span-2 row-span-2 p-0 flex flex-col justify-between bg-neutral-900 overflow-hidden relative group">
                <div className="absolute inset-0 z-0">
                    <img
                        src={avatarUrl}
                        alt={name}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                </div>

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

            {/* Location */}
            <BentoItem className="col-span-1 flex flex-col items-center justify-center p-6 relative group overflow-hidden">
                <div className="absolute inset-0 bg-neutral-800/50 group-hover:bg-neutral-800/30 transition-colors z-0" />
                <MapPin className="text-white w-10 h-10 mb-4 z-10" />
                <h3 className="text-white font-semibold z-10 text-xs md:text-lg">{location}</h3>
                <p className="text-neutral-500 text-xs z-10 mt-1 uppercase tracking-wide">Based In</p>
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-700 to-transparent" />
            </BentoItem>

            {/* Social Links */}
            <BentoItem className="col-span-1 p-6 flex flex-col justify-center gap-6">
                <div className="grid grid-cols-2 gap-4 h-full">
                    <SocialLink href={socials.github} icon={<Github size={24} />} />
                    <SocialLink href={socials.twitter} icon={<Twitter size={24} />} hoverColor="hover:bg-blue-500/20 hover:text-blue-400" />
                    <SocialLink href={socials.instagram} icon={<Instagram size={24} />} hoverColor="hover:bg-pink-600/20 hover:text-pink-500" />
                    <SocialLink href={socials.email} icon={<Mail size={24} />} hoverColor="hover:bg-emerald-500/20 hover:text-emerald-400" />
                </div>
            </BentoItem>

            {/* Tech Stack */}
            <BentoItem className="col-span-2 lg:col-span-1 p-5 flex flex-col overflow-y-auto scrollbar-hide">
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

            <SpotifyCard />

            {/* Project Trigger */}
            <CardTrigger
                onClick={() => setIsProjectOpen(true)}
                icon={<FolderOpen className="w-6 h-6" />}
                iconColor="text-purple-400"
                iconBg="bg-purple-500/10"
                hoverColor="group-hover:text-purple-300"
                borderColor="hover:border-purple-500/50"
                shadowColor="hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)]"
                gradient="from-purple-500/5"
                title={projects.length.toString()}
                subtitle="Selected Projects"
                action="Tap to view vault"
                isBigTitle
            />

            {/* Playground Link */}
            <Link href="/playground" className="col-span-1 md:col-span-1 h-full block">
                <CardTrigger
                    asDiv={true}
                    icon={<FlaskConical className="w-6 h-6" />}
                    iconColor="text-cyan-400"
                    iconBg="bg-cyan-500/10"
                    hoverColor="group-hover:text-cyan-300"
                    borderColor="hover:border-cyan-500/50"
                    shadowColor="hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]"
                    gradient="from-cyan-500/5"
                    title="Playground"
                    subtitle="Experiment Lab"
                    action="Tap to explore"
                    badgeText="Beta Testing"
                />
            </Link>

            {/* Contact Trigger */}
            <CardTrigger
                onClick={() => setIsContactOpen(true)}
                icon={<Send className="w-6 h-6" />}
                iconColor="text-indigo-400"
                iconBg="bg-indigo-500/10"
                hoverColor="group-hover:text-indigo-300"
                borderColor="hover:border-indigo-500/50"
                shadowColor="hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]"
                gradient="from-indigo-500/5"
                title="Say Hello"
                subtitle="Quick Contact"
                action="Tap to send a message"
            />

            <ProjectModal
                isOpen={isProjectOpen}
                onClose={() => setIsProjectOpen(false)}
                projects={projects}
            />

            <ContactModal
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />
        </div>
    );
};

// Helper Components to clean up JSX
const SocialLink = ({ href, icon, hoverColor = "hover:bg-neutral-800 hover:text-white" }: any) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center bg-neutral-800/50 rounded-2xl text-neutral-400 transition-colors ${hoverColor}`}
    >
        {icon}
    </a>
);

interface CardTriggerProps {
    onClick?: () => void;
    icon: React.ReactNode;
    iconColor: string;
    iconBg: string;
    hoverColor: string;
    borderColor: string;
    shadowColor: string;
    gradient: string;
    title: string;
    subtitle: string;
    action: string;
    isBigTitle?: boolean;
    asDiv?: boolean;
    badgeText?: string;
}

const CardTrigger = ({
    onClick, icon, iconColor, iconBg, hoverColor, borderColor, shadowColor, gradient, title, subtitle, action, isBigTitle, asDiv, badgeText
}: CardTriggerProps) => {
    const className = `w-full h-full bg-[#171717] border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between cursor-pointer transition-all group relative overflow-hidden ${borderColor} ${shadowColor}`;

    return (
        <div onClick={onClick} className={className}>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="flex justify-between items-start relative z-10 w-full">
                <div className="flex justify-between w-full">
                    <div className={`p-3 rounded-full transition-colors duration-300 ${iconBg} ${iconColor} group-hover:bg-opacity-100 group-hover:text-white`}>
                        {icon}
                    </div>
                    {badgeText ? (
                        <div className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-[10px] font-bold text-yellow-500 uppercase tracking-wide">
                            {badgeText}
                        </div>
                    ) : (
                        <div className="bg-neutral-800 rounded-full p-2 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                    )}
                </div>
            </div>

            <div className="relative z-10">
                <h3 className={`${isBigTitle ? 'text-4xl' : 'text-2xl'} font-bold text-white mb-1 group-hover:scale-105 origin-left transition-transform duration-300`}>
                    {title}
                </h3>
                <p className={`text-sm text-neutral-400 font-medium transition-colors ${hoverColor}`}>
                    {subtitle}
                </p>
                <p className="text-xs text-neutral-600 mt-2 transition-colors">
                    {action}
                </p>
            </div>
        </div>
    );
}
