// src/components/Player.js
import React, { useState, useRef, useEffect } from 'react';
import { FaPlayCircle, FaPauseCircle, FaForward, FaBackward, FaExpand, FaMinus, FaSquare } from 'react-icons/fa'; // Font Awesome icons
import Playlist from './Playlist'; // Playlist component
import './MusicPlayer.css'; // Custom CSS
import YTPlayer, { jasursList } from './YT'; // Import YouTube player and playlist

const Player = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVideo, setCurrentVideo] = useState({ title: '', url: '' }); // Separate current video state
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
            const newSong = { title: inputTitle || 'Untitled', url: inputLink };
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
            <h2>Now playing: {currentVideo.title}</h2>
            {/* Use the YTPlayer component */}
            <div className="youtube-container">
                <div className="video-wrapper">
                    {currentVideo.url ? ( // Check if currentVideo.url is defined
                        <YTPlayer
                            currentVideoIndex={videoTracks.indexOf(currentVideo)}
                            videoTracks={videoTracks}
                            onVideoEnd={onVideoEnd}
                            playerRef={playerRef}
                            autoplay={isPlaying} // Pass isPlaying to control autoplay
                        />
                    ) : (
                        <div class="text"><p>No video is currently playing. Give it a vibe with your music! 🎧😁</p></div> // Optional: show a message if no video is playing
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
                        <button onClick={addSong}>🎯</button>
                    </div>
                    {/* Use the Playlist component */}
                    <Playlist
                        customSongs={customSongs}
                        jasursList={jasursList}
                        currentVideoIndex={videoTracks.indexOf(currentVideo)}
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