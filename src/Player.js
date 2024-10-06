// src/components/Player.js
import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { FaPlay, FaPause, FaForward, FaBackward, FaArrowsAlt } from 'react-icons/fa';
import Playlist from './Playlist'; // Import Playlist component
import './MusicPlayer.css'; // Import the custom CSS

const Player = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isMiniPlayer, setIsMiniPlayer] = useState(false);
    const [customSongs, setCustomSongs] = useState([]);
    const [inputLink, setInputLink] = useState('');
    const [inputTitle, setInputTitle] = useState('');
    const [dropIndex, setDropIndex] = useState(null); // To track where the song is being dropped
    const playerRef = useRef(null);

    // Default playlist (Jasur's list)
    const jasursList = [
        { title: 'Heart is on fire', url: 'https://youtu.be/kBqqlW6-99M?si=kXaaJTqhA4PaY6Gd' },
        { title: 'Irakliy - Ya s toboy(cover)', url: 'https://youtu.be/3WmdZOF5bKk?si=LcXY8Gohxxx4cZSA' },
        { title: 'Vetrom stat` (cover)', url: 'https://youtu.be/kkzEs0gdvZI?si=Z456wgKuJd0aE_PA' },
        { title: 'Reamonn - Supergirl', url: 'https://youtu.be/ucI3IpuM-NQ?si=mH62PwU2B4_p1GFg' },
        { title: 'Another Love', url: 'https://youtu.be/MwpMEbgC7DA?si=8HUQvzasZEq-4AZL' },
        { title: 'Ava Max - So Am I', url: 'https://youtu.be/SxGLPVvNjvY?si=tVcL1slKTd_OOY3N' },
        { title: 'Arcade', url: 'https://youtu.be/Qau6mObfSGM?si=RsrcZ0VUCOHaEwE4' },
        { title: 'Chumoli', url: 'https://youtu.be/VNBxmb9VLRM?si=Fk7SNDPjp4MeqZuy' },
        { title: 'Heart is on fire', url: 'https://youtu.be/kBqqlW6-99M?si=kXaaJTqhA4PaY6Gd' },
    ];

    // Combine custom songs with Jasur's list
    const videoTracks = [...customSongs, ...jasursList];

    // Load custom songs from localStorage
    useEffect(() => {
        const savedSongs = JSON.parse(localStorage.getItem('customSongs'));
        if (savedSongs) {
            setCustomSongs(savedSongs);
        }
    }, []);

    // Save custom songs to localStorage
    useEffect(() => {
        localStorage.setItem('customSongs', JSON.stringify(customSongs));
    }, [customSongs]);

    // Extract YouTube video ID
    const extractVideoId = (url) => {
        // eslint-disable-next-line
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const opts = {
        height: '225',
        width: '400',
        playerVars: {
            autoplay: 1,
        },
    };

    // Play and Pause toggle
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
        setCurrentVideoIndex((prevIndex) => (prevIndex === 0 ? videoTracks.length - 1 : prevIndex - 1));
        setIsPlaying(true);
    };

    const playSelectedVideo = (index) => {
        setCurrentVideoIndex(index);
        setIsPlaying(true);
    };

    const toggleMiniPlayer = () => {
        setIsMiniPlayer(!isMiniPlayer);
    };

    const toggleFullScreen = () => {
        const playerContainer = document.getElementById('player-container');
        if (!document.fullscreenElement) {
            playerContainer.requestFullscreen().catch((err) => console.log(err));
        } else {
            document.exitFullscreen();
        }
    };

    const addSong = () => {
        if (inputLink) {
            const newSong = { title: inputTitle || 'Untitled', url: inputLink };
            setCustomSongs((prevSongs) => [...prevSongs, newSong]);
            setInputLink(''); // Reset link input
            setInputTitle(''); // Reset title input
        }
    };

    const deleteSong = (index) => {
        setCustomSongs((prevSongs) => prevSongs.filter((_, i) => i !== index));
    };

    const editSong = (index) => {
        const updatedTitle = prompt('Edit song title:', customSongs[index].title);
        if (updatedTitle) {
            setCustomSongs((prevSongs) => {
                const updatedSongs = [...prevSongs];
                updatedSongs[index].title = updatedTitle;
                return updatedSongs;
            });
        }
    };

    const handleDragStart = (e, track) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(track));
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        showDropLine(index); // Show drop line where the dragged item is hovering
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        const droppedSong = JSON.parse(e.dataTransfer.getData('text/plain'));

        // Ensure that the song isn't already in the customSongs list
        if (!customSongs.some((song) => song.url === droppedSong.url)) {
            setCustomSongs((prevSongs) => {
                const updatedSongs = [...prevSongs];
                updatedSongs.splice(index, 0, droppedSong); // Insert dropped song at the correct index
                return updatedSongs;
            });
        }
        setDropIndex(null); // Reset dropIndex after dropping
    };

    // Show drop line at a specific index
    const showDropLine = (index) => {
        setDropIndex(index);
    };

    return (
        <div className="music-player dark-mode" id="player-container"> {/* Only dark mode class */}
            <h2>{videoTracks[currentVideoIndex].title}</h2>
            <YouTube
                videoId={extractVideoId(videoTracks[currentVideoIndex].url)}
                opts={opts}
                onEnd={onVideoEnd}
                ref={playerRef}
            />
            <div className="controls">
                <FaBackward onClick={playPreviousVideo} />
                {isPlaying ? <FaPause onClick={onPlayPauseToggle} /> : <FaPlay onClick={onPlayPauseToggle} />}
                <FaForward onClick={playNextVideo} />
                <FaArrowsAlt onClick={toggleFullScreen} />
            </div>
            <button onClick={toggleMiniPlayer}>{isMiniPlayer ? '🟪' : '➖'}</button>

            {!isMiniPlayer && (
                <div>
                    <div className="add-song">
                        <input
                            type="text"
                            placeholder="YouTube Link"
                            value={inputLink}
                            onChange={(e) => setInputLink(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Song Title (optional)"
                            value={inputTitle}
                            onChange={(e) => setInputTitle(e.target.value)}
                        />
                        <button onClick={addSong}>🎯</button>
                    </div>
                    {/* Use the Playlist component */}
                    <Playlist
                        customSongs={customSongs}
                        jasursList={jasursList}
                        currentVideoIndex={currentVideoIndex}
                        playSelectedVideo={playSelectedVideo}
                        deleteSong={deleteSong}
                        editSong={editSong}
                        handleDragStart={handleDragStart}
                        handleDragOver={handleDragOver}
                        handleDrop={handleDrop}
                        dropIndex={dropIndex}
                    />
                </div>
            )}
        </div>
    );
};

export default Player;
