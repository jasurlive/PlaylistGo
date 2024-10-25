// src/components/Player.js
import React, { useState, useRef, useEffect } from 'react';
import { FaPlayCircle, FaPauseCircle, FaForward, FaBackward, FaExpand, FaMinus, FaSquare } from 'react-icons/fa'; // Font Awesome icons
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
        const nextIndex = (videoTracks.indexOf(currentVideo) + 1) % videoTracks.length;
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
            // Calculate the new song number based on the current length of customSongs
            const newSongIndex = customSongs.length + 1;
            // Set the new title to "Song #N" if no custom title is provided
            const newSong = { title: inputTitle || `Song #${newSongIndex}`, url: inputLink };

            setCustomSongs((prevSongs) => [...prevSongs, newSong]);
            setInputLink(''); // Reset link input
            setInputTitle(''); // Reset title input
        }
    };

    const deleteSong = (index) => {
        setCustomSongs((prevSongs) => {
            const updatedSongs = prevSongs.filter((_, i) => i !== index);

            // Adjust currentVideo if the deleted song was the currently playing video
            if (currentVideo.url === updatedSongs[index]?.url) {
                if (updatedSongs.length > 0) {
                    setCurrentVideo(updatedSongs[0]); // Change to the first song if available
                } else {
                    setCurrentVideo({ title: '', url: '' }); // Reset if no songs left
                    setIsPlaying(false); // Stop playing if there are no songs left
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
        setInputLink(''); // Reset link input
        setInputTitle(''); // Reset title input
        setIsEditing(false); // Reset editing state
        setEditIndex(-1); // Reset edit index
    };

    return (
        <div className="music-player dark-mode" id="player-container"> {/* Only dark mode class */}
            <h2>
                {isPlaying && (
                    <img
                        src={nowPlayingGif}
                        alt="Now Playing"
                        className="now-playing-big-gif" // Add the GIF if the song is currently playing
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
                            autoplay={isPlaying} // Pass isPlaying to control autoplay
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
