// src/components/MusicPlayer.js
import React, { useState, useRef } from 'react';
import YouTube from 'react-youtube';
import { FaPlay, FaPause, FaForward, FaBackward, FaArrowsAlt } from 'react-icons/fa';
import './MusicPlayer.css'; // Custom CSS for player styles


const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMiniPlayer, setIsMiniPlayer] = useState(false);

    // List of YouTube video URLs (including different formats)
    const videoTracks = [
        { title: 'Tosh', url: 'https://youtu.be/YcvGjB_MwMM?si=WnVgXpHkzbaPqQTK' },
        { title: 'Let her go ft Ed Sheeran', url: 'https://youtu.be/HTcL9WkB_wg?si=iBgVj9oc7s8zREbh' },
        { title: 'Chumoli', url: 'https://youtu.be/VNBxmb9VLRM?si=Fk7SNDPjp4MeqZuy' },
        { title: 'Heart is on fire', url: 'https://youtu.be/kBqqlW6-99M?si=kXaaJTqhA4PaY6Gd' },

    ];

    const playerRef = useRef(null);

    const extractVideoId = (url) => {
        // eslint-disable-next-line
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
        },
    };

    const onPlayPauseToggle = () => {
        const player = playerRef.current.internalPlayer;
        if (isPlaying) {
            player.pauseVideo();
            setIsPlaying(false);
        } else {
            player.playVideo();
            setIsPlaying(true);
        }
    };

    const onVideoEnd = () => {
        playNextVideo();
    };

    const playNextVideo = () => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoTracks.length);
        setIsPlaying(true);
    };

    const playPreviousVideo = () => {
        setCurrentVideoIndex((prevIndex) =>
            prevIndex === 0 ? videoTracks.length - 1 : prevIndex - 1
        );
        setIsPlaying(true);
    };

    const playSelectedVideo = (index) => {
        setCurrentVideoIndex(index);
        setIsPlaying(true);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleMiniPlayer = () => {
        setIsMiniPlayer(!isMiniPlayer);
    };

    const toggleFullScreen = () => {
        const playerContainer = document.getElementById('player-container');
        if (!document.fullscreenElement) {
            playerContainer.requestFullscreen().catch(err => console.log(err));
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className={`music-player ${isDarkMode ? 'dark-mode' : 'light-mode'}`} id="player-container">
            <h2>{videoTracks[currentVideoIndex].title}</h2>
            <YouTube
                videoId={extractVideoId(videoTracks[currentVideoIndex].url)}
                opts={opts}
                onEnd={onVideoEnd}
                ref={playerRef}
            />
            <div className="controls">
                <FaBackward onClick={playPreviousVideo} />
                {isPlaying ? (
                    <FaPause onClick={onPlayPauseToggle} />
                ) : (
                    <FaPlay onClick={onPlayPauseToggle} />
                )}
                <FaForward onClick={playNextVideo} />
                <FaArrowsAlt onClick={toggleFullScreen} />
            </div>
            <button onClick={toggleDarkMode}>
                Toggle Dark Mode
            </button>
            <button onClick={toggleMiniPlayer}>
                {isMiniPlayer ? 'Expand Player' : 'Minimize Player'}
            </button>
            {!isMiniPlayer && (
                <div className="song-list">
                    <h3>Playlist</h3>
                    <ul>
                        {videoTracks.map((track, index) => (
                            <li
                                key={index}
                                className={index === currentVideoIndex ? 'active' : ''}
                                onClick={() => playSelectedVideo(index)}
                            >
                                {track.title}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MusicPlayer;
