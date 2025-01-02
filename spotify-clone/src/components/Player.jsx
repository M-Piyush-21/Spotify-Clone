import React, { useContext, useEffect, useState } from "react";
import { assets } from "@assets";
import { PlayerContext } from "@context/PlayerContext";

const Player = () => {
    const {
        track,
        play,
        audioRef,
        playPause,
        nextSong,
        prevSong,
    } = useContext(PlayerContext);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        if (audioRef.current) {
            const audio = audioRef.current;
            
            const updateTime = () => {
                setCurrentTime(audio.currentTime);
                setDuration(audio.duration || 0);
            };

            audio.addEventListener('timeupdate', updateTime);
            audio.addEventListener('loadedmetadata', updateTime);

            return () => {
                audio.removeEventListener('timeupdate', updateTime);
                audio.removeEventListener('loadedmetadata', updateTime);
            };
        }
    }, [audioRef]);

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!track) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#181818] border-t border-[#282828] px-4 text-white">
            <div className="max-w-screen-xl mx-auto h-full flex items-center justify-between">
                {/* Track Info */}
                <div className="flex items-center gap-4 w-1/4">
                    <img 
                        src={track.image} 
                        alt={track.name} 
                        className="h-14 w-14 rounded"
                    />
                    <div>
                        <h4 className="text-sm font-semibold">{track.name}</h4>
                        <p className="text-xs text-gray-400">{track.desc}</p>
                    </div>
                </div>

                {/* Player Controls */}
                <div className="flex flex-col items-center gap-2 w-1/2">
                    <div className="flex items-center gap-6">
                        <button onClick={prevSong}>
                            <img src={assets.prev_icon} alt="Previous" className="h-4 w-4" />
                        </button>
                        <button 
                            onClick={playPause}
                            className="bg-white rounded-full p-2"
                        >
                            <img 
                                src={play ? assets.pause_icon : assets.play_icon} 
                                alt={play ? "Pause" : "Play"}
                                className="h-4 w-4"
                            />
                        </button>
                        <button onClick={nextSong}>
                            <img src={assets.next_icon} alt="Next" className="h-4 w-4" />
                        </button>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 w-full">
                        <span className="text-xs text-gray-400 w-10">
                            {formatTime(currentTime)}
                        </span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-gray-400 w-10">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2 w-1/4 justify-end">
                    <img src={assets.volume_icon} alt="Volume" className="h-4 w-4" />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
};

export default Player;
