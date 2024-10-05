// src/components/MusicPlayer.js
import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { FaPlay, FaPause, FaForward, FaBackward, FaArrowsAlt, FaTrash, FaEdit } from 'react-icons/fa';
import './MusicPlayer.css'; // Custom CSS for player styles

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMiniPlayer, setIsMiniPlayer] = useState(false);
    const [customSongs, setCustomSongs] = useState([]);
    const [inputLink, setInputLink] = useState('');
    const [inputTitle, setInputTitle] = useState('');
    const [dropIndex, setDropIndex] = useState(null); // To track the index where the song is being dropped
    const playerRef = useRef(null);

    // Default song list (Jasur's list)
    const jasursList = [
        { title: 'Heart is on fire', url: 'https://youtu.be/kBqqlW6-99M?si=kXaaJTqhA4PaY6Gd' },
        { title: 'Tosh', url: 'https://youtu.be/YcvGjB_MwMM?si=WnVgXpHkzbaPqQTK' },
        { title: 'Let her go ft Ed Sheeran', url: 'https://youtu.be/HTcL9WkB_wg?si=iBgVj9oc7s8zREbh' },
        { title: 'Chumoli', url: 'https://youtu.be/VNBxmb9VLRM?si=Fk7SNDPjp4MeqZuy' },
        { title: 'Heart is on fire', url: 'https://youtu.be/kBqqlW6-99M?si=kXaaJTqhA4PaY6Gd' },
    ];

    // Combine user custom songs with Jasur's list
    const videoTracks = [...customSongs, ...jasursList];

    // Load saved songs from localStorage
    useEffect(() => {
        const savedSongs = JSON.parse(localStorage.getItem('customSongs'));
        if (savedSongs) {
            setCustomSongs(savedSongs);
        }
    }, []);

    useEffect(() => {
        // Save custom songs to localStorage
        localStorage.setItem('customSongs', JSON.stringify(customSongs));
    }, [customSongs]);

    const extractVideoId = (url) => {
        // eslint-disable-next-line
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const opts = {
        height: '250',
        width: '440',
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

    const addSong = () => {
        if (inputLink) {
            const newSong = { title: inputTitle || 'Untitled', url: inputLink };
            setCustomSongs((prevSongs) => [...prevSongs, newSong]);
            setInputLink('');
            setInputTitle('');
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

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        const droppedSong = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (!customSongs.some(song => song.url === droppedSong.url)) {
            setCustomSongs((prevSongs) => {
                const updatedSongs = [...prevSongs];
                updatedSongs.splice(index, 0, droppedSong);
                return updatedSongs;
            });
        }
        setDropIndex(null); // Reset drop index
    };

    const showDropLine = (index) => {
        setDropIndex(index);
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
            <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
            <button onClick={toggleMiniPlayer}>
                {isMiniPlayer ? 'Expand Player' : 'Minimize Player'}
            </button>

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
                        <button onClick={addSong}>Add Song</button>
                    </div>
                    <div className="song-list">
                        <h3>Your Playlist 🎧</h3>
                        <ul>
                            {customSongs.map((track, index) => (
                                <li
                                    key={index}
                                    onDragStart={(e) => handleDragStart(e, track)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, index)}
                                    onMouseEnter={() => showDropLine(index)} // Show helper line
                                    onMouseLeave={() => setDropIndex(null)} // Hide helper line
                                    className={`song-item ${index === currentVideoIndex ? 'active' : ''} ${dropIndex === index ? 'drop-line' : ''}`}
                                    draggable
                                    onClick={() => playSelectedVideo(videoTracks.length + index)}
                                >
                                    {track.title}
                                    <FaEdit onClick={() => editSong(index)} />
                                    <FaTrash onClick={() => deleteSong(index)} />
                                </li>
                            ))}
                        </ul>
                        <h3>Jasur's Playlist 🎧</h3>
                        <ul>
                            {jasursList.map((track, index) => (
                                <li
                                    key={index}
                                    onDragStart={(e) => handleDragStart(e, track)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, customSongs.length + index)} // Drop index for Jasur's list
                                    onMouseEnter={() => showDropLine(customSongs.length + index)} // Show helper line
                                    onMouseLeave={() => setDropIndex(null)} // Hide helper line
                                    className={`song-item ${index === currentVideoIndex ? 'active' : ''} ${dropIndex === customSongs.length + index ? 'drop-line' : ''}`}
                                    draggable
                                    onClick={() => playSelectedVideo(index)}
                                >
                                    {track.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MusicPlayer;
