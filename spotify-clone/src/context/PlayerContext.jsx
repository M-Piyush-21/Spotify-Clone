import React, { createContext, useRef, useState, useEffect } from "react";
import axios from "axios";

export const PlayerContext = createContext();
export const url = "http://localhost:8000";

const PlayerContextProvider = ({ children }) => {
    const audioRef = useRef();
    const [songsData, setSongsData] = useState([]);
    const [albumsData, setAlbumData] = useState([]);
    const [track, setTrack] = useState(null);
    const [play, setPlay] = useState(false);
    const [loading, setLoading] = useState(true);

    const getSongsData = async () => {
        try {
            console.log('Fetching songs...');
            const response = await axios.get(`${url}/api/song/list`);
            console.log('Songs response:', response.data);
            if (response.data.success) {
                setSongsData(response.data.songs);
                if (response.data.songs.length > 0 && !track) {
                    setTrack(response.data.songs[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
    };

    const getAlbumsData = async () => {
        try {
            console.log('Fetching albums...');
            const response = await axios.get(`${url}/api/album/list`);
            console.log('Albums response:', response.data);
            if (response.data.success) {
                setAlbumData(response.data.albums);
            }
        } catch (error) {
            console.error("Error fetching albums:", error);
        } finally {
            setLoading(false);
        }
    };

    // Load initial data
    useEffect(() => {
        getSongsData();
        getAlbumsData();
    }, []);

    const playPause = () => {
        if (!audioRef.current) return;
        
        if (play) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(error => {
                console.error("Error playing audio:", error);
            });
        }
        setPlay(!play);
    };

    const nextSong = () => {
        if (!track || songsData.length === 0) return;
        
        const currentIndex = songsData.findIndex(song => song._id === track._id);
        if (currentIndex === songsData.length - 1) {
            setTrack(songsData[0]);
        } else {
            setTrack(songsData[currentIndex + 1]);
        }
    };

    const prevSong = () => {
        if (!track || songsData.length === 0) return;
        
        const currentIndex = songsData.findIndex(song => song._id === track._id);
        if (currentIndex === 0) {
            setTrack(songsData[songsData.length - 1]);
        } else {
            setTrack(songsData[currentIndex - 1]);
        }
    };

    // Handle audio events
    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;

        const handleEnded = () => {
            nextSong();
        };

        const handleError = (error) => {
            console.error("Audio error:", error);
            setPlay(false);
        };

        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
        };
    }, [track, songsData]);

    // Update audio source when track changes
    useEffect(() => {
        if (audioRef.current && track) {
            audioRef.current.src = track.url;
            if (play) {
                audioRef.current.play().catch(error => {
                    console.error("Error playing new track:", error);
                    setPlay(false);
                });
            }
        }
    }, [track]);

    const contextValue = {
        audioRef,
        track,
        setTrack,
        play,
        setPlay,
        playPause,
        nextSong,
        prevSong,
        songsData,
        setSongsData,
        albumsData,
        setAlbumData,
        getSongsData,
        getAlbumsData,
        loading
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {children}
            {track && (
                <audio
                    ref={audioRef}
                    src={track.url}
                />
            )}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;