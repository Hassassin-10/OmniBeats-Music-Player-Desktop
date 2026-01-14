
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useAudioStore } from '../../store/useAudioStore';

export const OmnitrixPlayer = () => {
    const { isPlaying, resume, pause, currentTrack, next, prev, volume, setVolume, seek, sound } = useAudioStore();
    const [currentTime, setCurrentTime] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const requestRef = useRef<number>();

    const togglePlay = () => {
        if (isPlaying) pause();
        else resume();
    };

    const updateTime = () => {
        if (sound && sound.playing() && !isDragging) {
            setCurrentTime(sound.seek());
        }
        requestRef.current = requestAnimationFrame(updateTime);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updateTime);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [sound, isDragging]);

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        seek(time);
    };

    const formatTime = (seconds: number) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none min-h-0">

            {/* Central Ring Container */}
            <div className="relative w-[300px] h-[300px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] flex items-center justify-center pointer-events-auto shrink-0">

                {/* Outer Rotating Gear/Ring - Clockwise */}
                <motion.div
                    className="absolute inset-0 rounded-full border-[6px] border-omni-green/20 border-t-omni-green border-r-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Rotating Ring - Counter-Clockwise */}
                <motion.div
                    className="absolute inset-4 rounded-full border-[2px] border-omni-green/40 border-dashed"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                {/* Visualizer Bars (Mocked) */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(24)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 bg-omni-green/40 origin-bottom"
                            style={{
                                height: '20px',
                                top: '50%',
                                left: '50%',
                                transform: `rotate(${i * 15}deg) translateY(-140px)`,
                            }}
                            animate={{ height: isPlaying ? [10, 40, 10] : 10, opacity: isPlaying ? [0.3, 0.8, 0.3] : 0.3 }}
                            transition={{
                                duration: 0.5 + Math.random(),
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: Math.random() * 0.5
                            }}
                        />
                    ))}
                </div>

                {/* Static Deco Ring */}
                <div className="absolute inset-8 rounded-full border border-omni-green/10 shadow-[0_0_30px_rgba(5,242,25,0.1)]" />

                {/* Central Hub Button (Restored) */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    className="w-48 h-48 bg-black rounded-full border-[6px] border-omni-dark relative box-border overflow-hidden group shadow-[0_0_50px_rgba(5,242,25,0.2)] z-20 flex items-center justify-center cursor-pointer"
                >
                    {/* Active Glow Background */}
                    <div className={`absolute inset-0 bg-omni-green transition-opacity duration-500 ${isPlaying ? 'opacity-20' : 'opacity-5'}`} />

                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center text-omni-green z-30">
                        {isPlaying ? <Pause size={64} fill="currentColor" /> : <Play size={64} fill="currentColor" className="ml-2" />}
                    </div>

                    {/* Scanline */}
                    <motion.div
                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-omni-green/10 to-transparent"
                        animate={{ top: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                    />
                </motion.button>
            </div>

            {/* Track Info Display */}
            <div className="mt-8 text-center z-10">
                <h3 className="text-2xl font-bold text-white drop-shadow-[0_0_5px_rgba(5,242,25,0.8)]">
                    {currentTrack ? currentTrack.name : "OMNIBEATS"}
                </h3>
                <p className="text-omni-green/70 text-sm tracking-widest mt-1">
                    {currentTrack ? currentTrack.artist : "WAITING FOR INPUT..."}
                </p>
            </div>

            {/* Control Bar (Glass Pill) - Engineered for Perfection */}
            <div className="mt-8 flex items-center justify-between gap-6 px-8 py-4 bg-black/60 backdrop-blur-xl rounded-full border border-omni-green/30 shadow-[0_0_20px_rgba(5,242,25,0.1)] z-20 w-auto max-w-2xl transition-all duration-300 hover:border-omni-green/50 hover:shadow-[0_0_30px_rgba(5,242,25,0.2)] pointer-events-auto">

                {/* Playback Controls Group */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={prev}
                        className="text-omni-green/80 hover:text-white hover:drop-shadow-[0_0_5px_rgba(5,242,25,1)] transition-all active:scale-95"
                    >
                        <SkipBack size={24} />
                    </button>

                    <button
                        onClick={next}
                        className="text-omni-green/80 hover:text-white hover:drop-shadow-[0_0_5px_rgba(5,242,25,1)] transition-all active:scale-95"
                    >
                        <SkipForward size={24} />
                    </button>
                </div>

                {/* Vertical Divider */}
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-omni-green/30 to-transparent mx-2" />

                {/* Seeker Group */}
                <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                    <span className="text-[10px] text-omni-green/60 font-mono w-9 text-right tabular-nums">{formatTime(currentTime)}</span>

                    <div className="group relative flex-1 h-6 flex items-center cursor-pointer">
                        {/* Track Background */}
                        <div className="absolute inset-x-0 h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                            {/* Fill */}
                            <div
                                className="h-full bg-omni-green/80 shadow-[0_0_10px_#05F219] relative"
                                style={{ width: `${(currentTime / (currentTrack?.duration || 1)) * 100}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_5px_#fff] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        {/* Invisible Input */}
                        <input
                            type="range"
                            min="0"
                            max={currentTrack?.duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            onMouseDown={() => setIsDragging(true)}
                            onMouseUp={() => setIsDragging(false)}
                            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                        />
                    </div>

                    <span className="text-[10px] text-omni-green/60 font-mono w-9 tabular-nums">{formatTime(currentTrack?.duration || 0)}</span>
                </div>

                {/* Vertical Divider */}
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-omni-green/30 to-transparent mx-2" />

                {/* Volume Group */}
                <div className="flex items-center gap-3 group/vol">
                    <button
                        onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
                        className="text-omni-green/60 hover:text-white transition-colors"
                    >
                        <Volume2 size={18} />
                    </button>
                    <div className="w-20 h-6 flex items-center relative">
                        <div className="absolute inset-x-0 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-omni-green/70"
                                style={{ width: `${volume * 100}%` }}
                            />
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                    </div>
                </div>

            </div>

        </div>
    );
}
