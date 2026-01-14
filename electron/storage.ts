import Store from 'electron-store';

export interface UserSchema {
    volume: number;
    lastPlayedTrack: string | null;
    libraryFolders: string[];
    playlists: Record<string, string[]>; // playlistId -> trackPaths[]
    favorites: string[]; // trackPaths[]
}

const schema = {
    volume: { type: 'number', default: 0.5 },
    lastPlayedTrack: { type: ['string', 'null'], default: null },
    libraryFolders: { type: 'array', items: { type: 'string' }, default: [] },
    playlists: { type: 'object', default: {} },
    favorites: { type: 'array', items: { type: 'string' }, default: [] },
} as const; // Simplified schema typing

const store = new Store<UserSchema>({
    schema: schema as unknown as any // Electron-store types can be tricky with complex schemas
});

export function getStore() {
    return store;
}
