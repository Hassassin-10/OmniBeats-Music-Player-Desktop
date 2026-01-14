import { useState } from 'react';
import { Search, Music, FolderPlus, Heart, ListMusic, Plus, Play } from 'lucide-react';
import { useAudioStore } from '../../store/useAudioStore';

type Tab = 'all' | 'favorites' | 'playlists';

export const LibraryView = () => {
    const { playTrack, currentTrack, queue, importFolder, favorites, playlists, toggleFavorite, createPlaylist, playPlaylist } = useAudioStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
    const [sortMethod, setSortMethod] = useState<'name' | 'artist'>('name');

    const getFilteredTracks = () => {
        let tracks = queue;
        if (activeTab === 'favorites') {
            tracks = queue.filter(t => favorites.includes(t.path));
        }
        // Note: 'playlists' tab renders playlists, not tracks directly

        let filtered = tracks.filter(t =>
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.artist.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered.sort((a, b) => {
            if (sortMethod === 'name') return a.name.localeCompare(b.name);
            return a.artist.localeCompare(b.artist);
        });
    };

    const handleCreatePlaylist = () => {
        if (newPlaylistName.trim()) {
            createPlaylist(newPlaylistName);
            setNewPlaylistName('');
            setShowCreatePlaylist(false);
        }
    };

    const filteredTracks = getFilteredTracks();

    return (
        <div className="flex flex-col h-full text-omni-green">
            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-omni-green/20 pb-2 justify-between items-center">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${activeTab === 'all' ? 'bg-omni-green text-black' : 'hover:bg-omni-green/10'}`}
                    >
                        ALL
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${activeTab === 'favorites' ? 'bg-omni-green text-black' : 'hover:bg-omni-green/10'}`}
                    >
                        FAV
                    </button>
                    <button
                        onClick={() => setActiveTab('playlists')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${activeTab === 'playlists' ? 'bg-omni-green text-black' : 'hover:bg-omni-green/10'}`}
                    >
                        LISTS
                    </button>
                </div>

                {/* Sort Toggle */}
                <button
                    onClick={() => setSortMethod(prev => prev === 'name' ? 'artist' : 'name')}
                    className="text-[10px] uppercase tracking-wider opacity-60 hover:opacity-100 hover:text-white transition-opacity"
                >
                    SORT: {sortMethod}
                </button>
            </div>

            <div className="mb-4 flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-omni-green/50" size={18} />
                    <input
                        type="text"
                        placeholder="SEARCH DNA..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-omni-dark/50 border border-omni-green/30 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-omni-green transition-colors placeholder-omni-green/30"
                    />
                </div>
                {activeTab === 'all' && (
                    <button
                        onClick={importFolder}
                        className="p-2 rounded-full border border-omni-green/30 hover:bg-omni-green hover:text-omni-black transition-colors"
                        title="Import Folder"
                    >
                        <FolderPlus size={20} />
                    </button>
                )}
                {activeTab === 'playlists' && (
                    <button
                        onClick={() => setShowCreatePlaylist(!showCreatePlaylist)}
                        className="p-2 rounded-full border border-omni-green/30 hover:bg-omni-green hover:text-omni-black transition-colors"
                        title="Create Playlist"
                    >
                        <Plus size={20} />
                    </button>
                )}
            </div>

            {showCreatePlaylist && activeTab === 'playlists' && (
                <div className="mb-4 flex gap-2 animate-in fade-in slide-in-from-top-2">
                    <input
                        autoFocus
                        type="text"
                        placeholder="PLAYLIST CODE NAME..."
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
                        className="flex-1 bg-omni-dark/80 border border-omni-green/50 rounded px-3 py-1 text-sm focus:outline-none text-white"
                    />
                    <button
                        onClick={handleCreatePlaylist}
                        className="px-3 py-1 bg-omni-green text-black text-xs font-bold rounded hover:opacity-80"
                    >
                        CREATE
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {activeTab === 'playlists' ? (
                    // Playlist List
                    playlists.length === 0 ? (
                        <div className="text-center text-omni-green/40 mt-10 text-sm">NO PLAYLISTS CONFIGURED.</div>
                    ) : (
                        playlists.map(pl => (
                            <div key={pl.id} className="group p-3 rounded flex items-center gap-3 cursor-pointer border border-transparent hover:border-omni-green/30 hover:bg-omni-green/5">
                                <div className="w-10 h-10 rounded bg-omni-dark/80 flex items-center justify-center text-omni-green/50">
                                    <ListMusic size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-omni-green">{pl.name}</div>
                                    <div className="text-xs text-omni-green/50">{pl.tracks.length} TRACKS</div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); playPlaylist(pl.id); }}
                                    className="p-2 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Play size={16} />
                                </button>
                            </div>
                        ))
                    )
                ) : (
                    // Track List
                    filteredTracks.length === 0 ? (
                        <div className="text-center text-omni-green/40 mt-10 text-sm">
                            {activeTab === 'favorites' ? "NO SAMPLES MARKED AS FAVORITE." : "NO AUDIO DNA DETECTED.\nIMPORT FILES TO BEGIN."}
                        </div>
                    ) : (
                        filteredTracks.map((track, idx) => (
                            <div
                                key={idx}
                                onClick={() => playTrack(track)}
                                className={`group p-3 rounded flex items-center gap-3 cursor-pointer transition-all border border-transparent hover:border-omni-green/30 hover:bg-omni-green/5 ${currentTrack?.path === track.path ? 'bg-omni-green/10 border-omni-green/50' : ''}`}
                            >
                                <div className="w-8 h-8 rounded bg-omni-dark/80 flex items-center justify-center text-omni-green/50 group-hover:text-omni-green transition-colors">
                                    <Music size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`text-sm font-medium truncate ${currentTrack?.path === track.path ? 'text-white' : 'text-omni-green'}`}>{track.name}</div>
                                    <div className="text-xs text-omni-green/60 truncate">{track.artist}</div>
                                </div>

                                {/* Favorite Button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
                                    className={`p-1.5 rounded-full transition-colors ${favorites.includes(track.path) ? 'text-omni-green hover:text-white' : 'text-transparent group-hover:text-omni-green/30 hover:text-omni-green'}`}
                                >
                                    <Heart size={14} fill={favorites.includes(track.path) ? "currentColor" : "none"} />
                                </button>

                                <div className="text-xs text-omni-green/40 group-hover:text-omni-green/70w-10 text-right">
                                    {Math.floor(track.duration / 60)}:{(Math.floor(track.duration % 60)).toString().padStart(2, '0')}
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    );
};
