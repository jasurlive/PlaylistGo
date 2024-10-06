// src/components/MusicPlayer.js
import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { FaPlay, FaPause, FaForward, FaBackward, FaArrowsAlt, FaTrash, FaEdit } from 'react-icons/fa';
import './MusicPlayer.css'; // Import the custom CSS

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMiniPlayer, setIsMiniPlayer] = useState(false);
    const [customSongs, setCustomSongs] = useState([]);
    const [inputLink, setInputLink] = useState('');
    const [inputTitle, setInputTitle] = useState('');
    const [dropIndex, setDropIndex] = useState(null); // To track where the song is being dropped
    const playerRef = useRef(null);

    // Default playlist (Jasur's list)
    const jasursList = [
        { title: 'Heart is on fire', url: 'https://youtu.be/kBqqlW6-99M?si=kXaaJTqhA4PaY6Gd' },
        { title: 'Tosh', url: 'https://youtu.be/YcvGjB_MwMM?si=WnVgXpHkzbaPqQTK' },
        { title: 'Let her go ft Ed Sheeran', url: 'https://youtu.be/HTcL9WkB_wg?si=iBgVj9oc7s8zREbh' },
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
        height: '250',
        width: '440',
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
        setCurrentVideoIndex((prevIndex) => prevIndex === 0 ? videoTracks.length - 1 : prevIndex - 1);
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
                {isPlaying ? <FaPause onClick={onPlayPauseToggle} /> : <FaPlay onClick={onPlayPauseToggle} />}
                <FaForward onClick={playNextVideo} />
                <FaArrowsAlt onClick={toggleFullScreen} />
            </div>
            <button onClick={toggleDarkMode}>🌙</button>
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
                        <button onClick={addSong}>Add Song</button>
                    </div>
                    <div className="playlists-container">
                        <div className="playlist-section">
                            <h3>Your Playlist 🎧</h3>
                            <ul>
                                {customSongs.map((track, index) => (
                                    <li
                                        key={index}
                                        className="song-item" // Added class for styling
                                        onDragStart={(e) => handleDragStart(e, track)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDrop={(e) => handleDrop(e, index)}
                                        onClick={() => playSelectedVideo(index)}
                                        draggable
                                    >
                                        {track.title}{' '}
                                        <FaEdit onClick={(e) => { e.stopPropagation(); editSong(index); }} />
                                        <FaTrash onClick={(e) => { e.stopPropagation(); deleteSong(index); }} />
                                        {dropIndex === index && <div className="drop-line">Drop Here</div>}
                                    </li>
                                ))}
                                {/* Drop Line */}
                                {dropIndex === customSongs.length && (
                                    <li className="drop-line-container">
                                        <div className="drop-line">Drop Here</div>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="jasurs-list">
                            <h3>Jasur's List 🎶</h3>
                            <ul>
                                {jasursList.map((track, index) => (
                                    <li
                                        key={index}
                                        className="song-item" // Added class for styling
                                        onDragStart={(e) => handleDragStart(e, track)}
                                        draggable
                                        onClick={() => playSelectedVideo(customSongs.length + index)}
                                    >
                                        {track.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MusicPlayer;
