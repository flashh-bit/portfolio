import { BentoItem } from "./BentoItem";
import { portfolioData } from "@/app/data/portfolio";
import { Github, Twitter, Instagram, Mail, MapPin, Music, Code2, ArrowUpRight } from "lucide-react";
import { SpotifyCard } from "./SpotifyCard";

export const GridLayout = () => {
    const { name, greeting, role, bio, location, avatarUrl, techStack, socials, spotify, projects } = portfolioData;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-8 max-w-6xl mx-auto auto-rows-[180px] md:auto-rows-[250px]">

            {/* Item 1: Profile & Bio - Big prominent block */}

            <BentoItem className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 p-0 flex flex-col justify-between bg-neutral-900 overflow-hidden relative group">

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
                <h3 className="text-white font-semibold z-10 text-lg">{location}</h3>
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
            <BentoItem className="col-span-1 md:col-span-2 lg:col-span-1 p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4 text-neutral-300">
                    <Code2 size={20} />
                    <h3 className="font-bold">Tech Stack</h3>
                </div>
                <div className="flex flex-wrap gap-2 content-start">
                    {techStack.map((tech) => (
                        <span key={tech} className="px-3 py-1.5 text-xs md:text-sm bg-neutral-800 text-neutral-300 rounded-full border border-neutral-700/50">
                            {tech}
                        </span>
                    ))}
                </div>
            </BentoItem>

            {/* Item 5: Spotify/Status */}
            <SpotifyCard />

            {/* Project Showcase - All Projects */}
            {projects.map((project, index) => (
                <BentoItem key={project.title} className="col-span-1 md:col-span-2 lg:col-span-2 p-6 md:p-8 flex flex-col justify-between group relative">
                    <a href={project.link || "#"} className="absolute inset-0 z-20" aria-label={`View ${project.title}`} />
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider border border-neutral-700 px-2 py-1 rounded-md mb-2 inline-block">
                                {index === 0 ? "Featured" : "Project"}
                            </span>
                            <h3 className="text-xl md:text-3xl font-bold text-white group-hover:text-purple-400 transition-colors relative z-10">
                                {project.title}
                            </h3>
                        </div>
                        <ArrowUpRight className="text-neutral-500 group-hover:text-white transition-colors relative z-10" />
                    </div>
                    <p className="text-neutral-400 text-sm md:text-base max-w-md relative z-10">
                        {project.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2 relative z-10">
                        {project.tech.map(t => (
                            <span key={t} className="text-xs text-neutral-500">#{t}</span>
                        ))}
                    </div>
                    {/* Subtle hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
                </BentoItem>
            ))}

        </div>
    );
};
