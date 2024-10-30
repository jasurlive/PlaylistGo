// src/components/Player.js
import React, { useState, useRef, useEffect } from 'react';
import { FaPlayCircle, FaPauseCircle, FaForward, FaBackward, FaExpand, FaMinus, FaSquare, FaRandom } from 'react-icons/fa';

import Playlist from './Playlist'; // Playlist component
import './MusicPlayer.css'; // Custom CSS
import YTPlayer, { jasursList } from './YT';
import nowPlayingGif from './img/equal_big.gif';

const Player = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVideo, setCurrentVideo] = useState({ title: '', url: '' }); // Separate current video state
    const [isMiniPlayer, setIsMiniPlayer] = useState(false);
    const [customSongs, setCustomSongs] = useState([]);
    const [inputLink, setInputLink] = useState('');
    const [inputTitle, setInputTitle] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(-1); // To track which song is being edited
    const [isShuffle, setIsShuffle] = useState(false); // Shuffle mode state
    const playerRef = useRef(null);

    // Combine custom songs with Jasur's list
    const videoTracks = [...customSongs, ...jasursList];

    // Load custom songs from localStorage
    useEffect(() => {
        const savedSongs = JSON.parse(localStorage.getItem('customSongs'));
        if (savedSongs) {
            setCustomSongs(savedSongs);
        }

        // Select a random song from jasursList if no custom songs exist
        if (savedSongs?.length === 0) {
            const randomIndex = Math.floor(Math.random() * jasursList.length);
            setCurrentVideo(jasursList[randomIndex]); // Set random song from jasursList
            setIsPlaying(true); // Start playing immediately
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
        let nextIndex;
        if (isShuffle) {
            // Get a random index different from the current video
            nextIndex = Math.floor(Math.random() * videoTracks.length);
        } else {
            nextIndex = (videoTracks.indexOf(currentVideo) + 1) % videoTracks.length;
        }
        setCurrentVideo(videoTracks[nextIndex]);
        setIsPlaying(true);
    };

    const playPreviousVideo = () => {
        const prevIndex = (videoTracks.indexOf(currentVideo) - 1 + videoTracks.length) % videoTracks.length;
        setCurrentVideo(videoTracks[prevIndex]);
        setIsPlaying(true);
    };

    const playSelectedVideo = (index) => {
        const selectedVideo = videoTracks[index];
        setCurrentVideo(selectedVideo);
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
            const newSongIndex = customSongs.length + 1;
            const newSong = { title: inputTitle || `Song #${newSongIndex}`, url: inputLink };

            setCustomSongs((prevSongs) => [...prevSongs, newSong]);
            setInputLink('');
            setInputTitle('');
        }
    };

    const deleteSong = (index) => {
        setCustomSongs((prevSongs) => {
            const updatedSongs = prevSongs.filter((_, i) => i !== index);

            if (currentVideo.url === updatedSongs[index]?.url) {
                if (updatedSongs.length > 0) {
                    setCurrentVideo(updatedSongs[0]);
                } else {
                    setCurrentVideo({ title: '', url: '' });
                    setIsPlaying(false);
                }
            }

            return updatedSongs;
        });
    };

    const editSong = (index) => {
        setInputTitle(customSongs[index].title);
        setInputLink(customSongs[index].url);
        setEditIndex(index);
        setIsEditing(true);
    };

    const updateSong = () => {
        setCustomSongs((prevSongs) => {
            const updatedSongs = [...prevSongs];
            updatedSongs[editIndex] = { title: inputTitle, url: inputLink };
            return updatedSongs;
        });
        setInputLink('');
        setInputTitle('');
        setIsEditing(false);
        setEditIndex(-1);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            isEditing ? updateSong() : addSong();
        }
    };

    return (
        <div className="music-player dark-mode" id="player-container"> {/* Only dark mode class */}
            <h2>
                {isPlaying && (
                    <img
                        src={nowPlayingGif}
                        alt="Now Playing"
                        className="now-playing-big-gif"
                    />
                )}
                Now playing: {currentVideo.title}
            </h2>

            <div className="youtube-container">
                <div className="video-wrapper">
                    {currentVideo.url ? (
                        <YTPlayer
                            currentVideoIndex={videoTracks.indexOf(currentVideo)}
                            videoTracks={videoTracks}
                            onVideoEnd={onVideoEnd}
                            playerRef={playerRef}
                            autoplay={isPlaying}
                        />
                    ) : (
                        <div className="text"><p>No video is currently playing. Give it a vibe with your music! 🎧😁</p></div>
                    )}
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
                <div className={`shuffle-button ${isShuffle ? 'active' : ''}`} onClick={() => setIsShuffle(!isShuffle)} style={{ cursor: 'pointer' }}>
                    <FaRandom />
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
                            onKeyDown={handleKeyDown}
                        />
                        <input
                            type="text"
                            placeholder="Song Title (optional)"
                            value={inputTitle}
                            onChange={(e) => setInputTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={isEditing ? updateSong : addSong}>
                            {isEditing ? '✅ Update' : '🛒 Add'}
                        </button>
                    </div>
                    <Playlist
                        customSongs={customSongs.map((song, index) => ({
                            ...song,
                            title: song.title || `Song #${index + 1}`, // Number songs
                        }))}
                        jasursList={jasursList}
                        currentVideoIndex={videoTracks.indexOf(currentVideo)}
                        playSelectedVideo={playSelectedVideo}
                        deleteSong={deleteSong}
                        editSong={editSong}
                        setCustomSongs={setCustomSongs} // Pass setCustomSongs to enable reordering
                    />
                </div>
            )}
        </div>
    );
};

export default Player;
