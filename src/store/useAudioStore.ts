import { create } from 'zustand';
import { Howl } from 'howler';
import { v4 as uuidv4 } from 'uuid';

export interface Track {
    id?: string;
    path: string;
    name: string;
    artist: string;
    album: string;
    duration: number;
}

export interface Playlist {
    id: string;
    name: string;
    tracks: string[]; // paths
}

interface AudioState {
    currentTrack: Track | null;
    isPlaying: boolean;
    volume: number;
    sound: Howl | null;
    queue: Track[];

    // Advanced State
    playlists: Playlist[];
    favorites: string[]; // paths

    setVolume: (vol: number) => void;
    playTrack: (track: Track) => void;
    pause: () => void;
    resume: () => void;
    next: () => void;
    prev: () => void;

    // Library Actions
    importFolder: () => Promise<void>;
    addToQueue: (tracks: Track[]) => void;
    loadSettings: () => Promise<void>;
    seek: (seconds: number) => void;

    // Playlist/Favorite Actions
    createPlaylist: (name: string) => void;
    addToPlaylist: (playlistId: string, track: Track) => void;
    toggleFavorite: (track: Track) => void;
    playPlaylist: (playlistId: string) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
    currentTrack: null,
    isPlaying: false,
    volume: 0.5,
    sound: null,
    queue: [],
    playlists: [],
    favorites: [],

    setVolume: (vol: number) => {
        const { sound } = get();
        if (sound) sound.volume(vol);
        set({ volume: vol });
        window.electronAPI?.setStoreValue('volume', vol);
    },

    playTrack: (track: Track) => {
        const { sound } = get();
        if (sound) sound.unload();

        const fileUrl = 'file:///' + track.path.replace(/\\/g, '/');

        const newSound = new Howl({
            src: [fileUrl],
            html5: true,
            volume: get().volume,
            onend: () => {
                get().next();
            },
            onplay: () => set({ isPlaying: true }),
            onpause: () => set({ isPlaying: false }),
            onstop: () => set({ isPlaying: false }),
            onloaderror: (_id: unknown, err: unknown) => console.error('Load Error:', err, fileUrl),
            onplayerror: (_id: unknown, err: unknown) => console.error('Play Error:', err),
        });

        newSound.play();
        set({ currentTrack: track, sound: newSound });
        window.electronAPI?.setStoreValue('lastPlayedTrack', track.path);
    },

    pause: () => {
        const { sound } = get();
        sound?.pause();
    },

    resume: () => {
        const { sound } = get();
        sound?.play();
    },

    next: () => {
        const { queue, currentTrack, playTrack } = get();
        const idx = queue.findIndex(t => t.path === currentTrack?.path);
        if (idx !== -1 && idx < queue.length - 1) {
            playTrack(queue[idx + 1]);
        }
    },

    prev: () => {
        const { queue, currentTrack, playTrack } = get();
        const idx = queue.findIndex(t => t.path === currentTrack?.path);
        if (idx > 0) {
            playTrack(queue[idx - 1]);
        }
    },

    addToQueue: (tracks) => {
        set(state => ({ queue: [...state.queue, ...tracks] }));
    },

    seek: (seconds: number) => {
        const { sound } = get();
        if (sound) {
            sound.seek(seconds);
        }
    },

    importFolder: async () => {
        if (!window.electronAPI) return;
        try {
            const folderPath = await window.electronAPI.selectFolder();
            if (folderPath) {
                const tracks = await window.electronAPI.scanFolder(folderPath);
                if (tracks && tracks.length > 0) {
                    set(state => {
                        // Simple de-dupe
                        const existingPaths = new Set(state.queue.map(t => t.path));
                        const newTracks = tracks.filter(t => !existingPaths.has(t.path));
                        return { queue: [...state.queue, ...newTracks] };
                    });

                    const currentFolders: string[] = await window.electronAPI.getStoreValue('libraryFolders') || [];
                    if (!currentFolders.includes(folderPath)) {
                        const newFolders = [...currentFolders, folderPath];
                        await window.electronAPI.setStoreValue('libraryFolders', newFolders);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to import folder:", error);
        }
    },

    loadSettings: async () => {
        if (!window.electronAPI) return;
        try {
            const volume = await window.electronAPI.getStoreValue('volume');
            if (typeof volume === 'number') set({ volume });

            const folders: string[] = await window.electronAPI.getStoreValue('libraryFolders') || [];
            for (const folder of folders) {
                const tracks = await window.electronAPI.scanFolder(folder);
                set(state => {
                    const existingPaths = new Set(state.queue.map(t => t.path));
                    const newTracks = tracks.filter(t => !existingPaths.has(t.path));
                    return { queue: [...state.queue, ...newTracks] };
                });
            }

            const favs = await window.electronAPI.getStoreValue('favorites') || [];
            set({ favorites: favs });

            const savedPlaylists = await window.electronAPI.getStoreValue('playlists') || {};
            // Convert object to array
            const playlistArray = Object.entries(savedPlaylists).map(([id, data]: [string, any]) => ({
                id,
                name: data.name,
                tracks: data.tracks
            }));
            set({ playlists: playlistArray });

        } catch (error) {
            console.error("Failed to load settings:", error);
        }
    },

    createPlaylist: (name: string) => {
        const newPlaylist: Playlist = { id: uuidv4(), name, tracks: [] };
        set(state => {
            const updated = [...state.playlists, newPlaylist];
            // Persist
            const storeObj = updated.reduce((acc, p) => ({ ...acc, [p.id]: { name: p.name, tracks: p.tracks } }), {});
            window.electronAPI?.setStoreValue('playlists', storeObj);
            return { playlists: updated };
        });
    },

    addToPlaylist: (playlistId: string, track: Track) => {
        set(state => {
            const updated = state.playlists.map(p => {
                if (p.id === playlistId && !p.tracks.includes(track.path)) {
                    return { ...p, tracks: [...p.tracks, track.path] };
                }
                return p;
            });
            // Persist
            const storeObj = updated.reduce((acc, p) => ({ ...acc, [p.id]: { name: p.name, tracks: p.tracks } }), {});
            window.electronAPI?.setStoreValue('playlists', storeObj);
            return { playlists: updated };
        });
    },

    toggleFavorite: (track: Track) => {
        set(state => {
            let newFavs;
            if (state.favorites.includes(track.path)) {
                newFavs = state.favorites.filter(p => p !== track.path);
            } else {
                newFavs = [...state.favorites, track.path];
            }
            window.electronAPI?.setStoreValue('favorites', newFavs);
            return { favorites: newFavs };
        });
    },

    playPlaylist: (playlistId: string) => {
        const { playlists, queue, playTrack } = get();
        const playlist = playlists.find(p => p.id === playlistId);
        if (playlist && playlist.tracks.length > 0) {
            // Find full track objects from queue
            const playlistTracks = queue.filter(t => playlist.tracks.includes(t.path));
            if (playlistTracks.length > 0) {
                playTrack(playlistTracks[0]);
                // Ideally we should set a "playback context" so Next/Prev stays in playlist
                // For now, simplified: just playing first track, queue remains global
            }
        }
    }

}));
