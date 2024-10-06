// src/components/Player.js
import React, { useState, useRef, useEffect } from 'react';
import { FaPlayCircle, FaPauseCircle, FaForward, FaBackward, FaExpand, FaMinus, FaSquare } from 'react-icons/fa'; // Font Awesome icons
import Playlist from './Playlist'; // Playlist component
import './MusicPlayer.css'; // Custom CSS
import YTPlayer, { jasursList } from './YT'; // Import YouTube player and playlist

const Player = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isMiniPlayer, setIsMiniPlayer] = useState(false);
    const [customSongs, setCustomSongs] = useState([]);
    const [inputLink, setInputLink] = useState('');
    const [inputTitle, setInputTitle] = useState('');
    const [dropIndex, setDropIndex] = useState(null); // To track where the song is being dropped
    const playerRef = useRef(null);

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
            <h2>Now playing: {videoTracks[currentVideoIndex].title}</h2>
            {/* Use the YTPlayer component */}
            <div className="youtube-container">
                <div className="video-wrapper">
                    <YTPlayer
                        currentVideoIndex={currentVideoIndex}
                        videoTracks={videoTracks}
                        onVideoEnd={onVideoEnd}
                        playerRef={playerRef}
                    />
                </div>
            </div>
            <div className="controls">
                <FaBackward onClick={playPreviousVideo} style={{ cursor: 'pointer' }} />
                {isPlaying ? (
                    <FaPauseCircle onClick={onPlayPauseToggle} style={{ cursor: 'pointer' }} />
                ) : (
                    <FaPlayCircle onClick={onPlayPauseToggle} style={{ cursor: 'pointer' }} />
                )}
                <FaForward onClick={playNextVideo} style={{ cursor: 'pointer' }} />
                <FaExpand onClick={toggleFullScreen} style={{ cursor: 'pointer' }} />
                <div onClick={toggleMiniPlayer} style={{ cursor: 'pointer' }}>
                    {isMiniPlayer ? <FaSquare /> : <FaMinus />}
                </div>
            </div>

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
