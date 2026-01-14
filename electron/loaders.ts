import fs from 'fs';
import path from 'path';
import { parseFile } from 'music-metadata';

const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.flac', '.ogg']);

export interface AudioTrack {
    id: string;
    path: string;
    name: string;
    artist: string;
    album: string;
    duration: number;
}

export async function scanFolder(folderPath: string): Promise<AudioTrack[]> {
    const tracks: AudioTrack[] = [];

    async function traverse(currentPath: string) {
        const entries = await fs.promises.readdir(currentPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);

            if (entry.isDirectory()) {
                await traverse(fullPath);
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase();
                if (AUDIO_EXTENSIONS.has(ext)) {
                    try {
                        const metadata = await parseFile(fullPath);
                        tracks.push({
                            id: fullPath, // Simple ID for now
                            path: fullPath,
                            name: metadata.common.title || entry.name,
                            artist: metadata.common.artist || 'Unknown Artist',
                            album: metadata.common.album || 'Unknown Album',
                            duration: metadata.format.duration || 0,
                        });
                    } catch (error) {
                        console.error(`Failed to parse metadata for ${fullPath}:`, error);
                        // Fallback
                        tracks.push({
                            id: fullPath,
                            path: fullPath,
                            name: entry.name,
                            artist: 'Unknown',
                            album: 'Unknown',
                            duration: 0,
                        });
                    }
                }
            }
        }
    }

    await traverse(folderPath);
    return tracks;
}
