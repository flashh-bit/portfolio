import { getNowPlaying } from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await getNowPlaying();

        if (response.status === 204 || response.status > 400) {
            // DEBUG: Return the actual error reason to help diagnosis
            const errorData = await response.text(); 
            console.log("Spotify API Error:", response.status, errorData);
            return NextResponse.json({ 
                isPlaying: false, 
                debug_status: response.status,
                debug_error: errorData 
            });
        }

        const song = await response.json();

        if (song.item === null) {
            return NextResponse.json({ isPlaying: false, debug_message: "Song item is null" });
        }

        const isPlaying = song.is_playing;
        const title = song.item.name;
        const artist = song.item.artists.map((_artist: any) => _artist.name).join(", ");
        const album = song.item.album.name;
        const albumImageUrl = song.item.album.images[0].url;
        const songUrl = song.item.external_urls.spotify;

        return NextResponse.json({
            isPlaying,
            title,
            artist,
            album,
            albumImageUrl,
            songUrl,
        });
    } catch (error) {
        console.error("Error fetching Spotify data:", error);
        return NextResponse.json({ 
            isPlaying: false, 
            debug_error: "Catch block triggered",
            debug_details: String(error)
        });
    }
}

export const dynamic = 'force-dynamic';
