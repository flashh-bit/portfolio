"use client";

import { Music } from "lucide-react";
import { useEffect, useState } from "react";
import { BentoItem } from "./BentoItem";

interface SpotifyData {
    isPlaying: boolean;
    title: string;
    artist: string;
    album: string;
    albumImageUrl: string;
    songUrl: string;
}

export const SpotifyCard = () => {
    const [data, setData] = useState<SpotifyData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/spotify");
                const json = await res.json();
                setData(json);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Spotify data", error);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll every 10 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <BentoItem className="col-span-2 lg:col-span-1 p-6 flex flex-col justify-between bg-gradient-to-br from-neutral-900 to-green-900/20 overflow-hidden relative group">
            <div className="flex justify-between items-start z-10">
                <div className="bg-green-500/10 p-2 rounded-full backdrop-blur-sm">
                    <Music className="text-green-500 w-6 h-6" />
                </div>
                {data?.isPlaying && (
                    <div className="flex space-x-1">
                        <div className="w-1 h-3 bg-green-500 rounded-full animate-[bounce_1s_infinite]" />
                        <div className="w-1 h-5 bg-green-500 rounded-full animate-[bounce_1.2s_infinite]" />
                        <div className="w-1 h-3 bg-green-500 rounded-full animate-[bounce_0.8s_infinite]" />
                    </div>
                )}
            </div>

            <div className="z-10 mt-4">
                {loading ? (
                    <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                        <div className="h-3 bg-neutral-800 rounded w-1/2"></div>
                    </div>
                ) : data?.isPlaying ? (
                    <a href={data.songUrl} target="_blank" rel="noopener noreferrer" className="block group-hover:translate-x-1 transition-transform">
                        <p className="text-xs text-green-400 uppercase font-semibold mb-1 tracking-wider">Currently listening to</p>
                        <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 mb-1">{data.title}</h3>
                        <p className="text-neutral-400 text-sm line-clamp-1">{data.artist}</p>
                    </a>
                ) : (
                    <div>
                        <p className="text-xs text-neutral-500 uppercase font-semibold mb-1 tracking-wider">Spotify</p>
                        <h3 className="text-neutral-300 font-bold text-lg leading-tight">Not Listening</h3>
                        <p className="text-neutral-500 text-sm">Offline</p>
                    </div>
                )}
            </div>

            {/* Background Album Art Blur */}
            {data?.isPlaying && data.albumImageUrl && (
                <div
                    className="absolute inset-0 opacity-20 blur-xl scale-125 pointer-events-none transition-all duration-1000"
                    style={{ backgroundImage: `url(${data.albumImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
            )}

            {/* Hover Effect overlay */}
            <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-neutral-900/0 transition-colors pointer-events-none" />
        </BentoItem>
    );
};
