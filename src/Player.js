// src/components/Player.js
import React, { useState, useRef, useEffect } from 'react';
import { FaPlayCircle, FaPauseCircle, FaForward, FaBackward, FaExpand, FaMinus, FaSquare, FaRandom, FaPlus, FaCheckCircle, FaTimes, FaRedoAlt } from 'react-icons/fa';

import Playlist from './Playlist';
import './MusicPlayer.css';
import YTPlayer, { jasursList } from './YT';
import nowPlayingGif from './img/equal_big.gif';
import Shortcuts from './Shortcuts';


const Player = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVideo, setCurrentVideo] = useState({ title: '', url: '' });
    const [isMiniPlayer, setIsMiniPlayer] = useState(false);
    const [customSongs, setCustomSongs] = useState([]);
    const [inputLink, setInputLink] = useState('');
    const [inputTitle, setInputTitle] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);
    const [isShuffle, setIsShuffle] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [addedSongs, setAddedSongs] = useState(new Set()); // Track added songs
    const [playedSongs, setPlayedSongs] = useState(new Set()); // Track played songs in shuffle mode
    const [isRepeatOne, setIsRepeatOne] = useState(false); // Repeat-one mode state

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
            setCurrentVideo(jasursList[randomIndex]);
            setIsPlaying(true);
        }
    }, []);

    // Save custom songs to localStorage
    useEffect(() => {
        localStorage.setItem('customSongs', JSON.stringify(customSongs));
    }, [customSongs]);



    const resultsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (resultsRef.current && !resultsRef.current.contains(event.target)) {
                clearSearch(); // Clear the search query and results
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


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
        if (isRepeatOne) {
            playerRef.current.internalPlayer.playVideo(); // Replay the same video
        } else {
            playNextVideo();
        }
    };


    const playNextVideo = () => {
        let nextIndex;

        if (isShuffle) {
            // Find an unplayed song for shuffle
            const unplayedSongs = videoTracks.filter((_, i) => !playedSongs.has(i));
            if (unplayedSongs.length === 0) {
                // All songs have been played at least once
                setIsPlaying(false);
                setPlayedSongs(new Set()); // Reset the played songs set
                return; // Exit function to stop playback
            }
            nextIndex = videoTracks.indexOf(unplayedSongs[Math.floor(Math.random() * unplayedSongs.length)]);
            setPlayedSongs((prev) => new Set(prev).add(nextIndex));
        } else {
            // Regular playback
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

        if (isShuffle) {
            // Add to played songs in shuffle mode
            setPlayedSongs((prev) => new Set(prev).add(index));
        }
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

            // Add the song to the top of the list
            setCustomSongs((prevSongs) => [newSong, ...prevSongs]); // New song at the start
            setAddedSongs((prev) => new Set(prev).add(newSong.url)); // Mark this song as added
            setInputLink('');
            setInputTitle('');
        }
    };

    const addSongFromSearch = (song) => {
        // Add the song to the top of the list
        setCustomSongs((prevSongs) => [song, ...prevSongs]); // New song at the start
        setAddedSongs((prev) => new Set(prev).add(song.url)); // Mark this song as added
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

        // Remove the song from added songs if deleted
        const songToDelete = customSongs[index];
        if (songToDelete) {
            setAddedSongs((prev) => {
                const newSet = new Set(prev);
                newSet.delete(songToDelete.url);
                return newSet;
            });
        }
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
    // eslint-disable-next-line
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            isEditing ? updateSong() : addSong();
        }
    };

    const searchYouTube = async () => {
        if (!searchQuery) return;

        const API_KEY = 'AIzaSyDmXg_MlBEvUb3oAtMpj-fi4Fet80b21fM';
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=50&key=${API_KEY}`); // Set maxResults to a default value
            const data = await response.json();

            if (Array.isArray(data.items)) {
                const results = data.items.map(item => ({
                    title: item.snippet.title,
                    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                    thumbnail: item.snippet.thumbnails.default.url
                }));
                setSearchResults(results);
            } else {
                console.error('Unexpected response structure:', data);
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error fetching data from YouTube API:', error);
            setSearchResults([]);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    const closeSearchResults = () => {
        clearSearch();
    };

    return (
        <div className="music-player dark-mode" id="player-container">

            {/* Shortcuts component to enable keyboard shortcuts */}
            <Shortcuts
                onSearchFocus={() => document.querySelector('input[type="text"]').focus()}
                onPlayPauseToggle={onPlayPauseToggle}
                onPlayPrevious={playPreviousVideo}
                onPlayNext={playNextVideo}
                onToggleShuffle={() => {
                    setIsShuffle(!isShuffle);
                    if (!isShuffle) setPlayedSongs(new Set()); // Reset played songs when shuffle mode is enabled
                }}
                onToggleFullScreen={toggleFullScreen}
                onToggleRepeatOne={() => setIsRepeatOne(!isRepeatOne)} // Pass the repeat-one toggle function here
            />


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
                {/* Control icons */}
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
                <div className={`shuffle-button ${isShuffle ? 'active' : ''}`}
                    onClick={() => {
                        setIsShuffle(!isShuffle);
                        if (!isShuffle) setPlayedSongs(new Set()); // Reset played songs when shuffle mode is enabled
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <FaRandom /> {/* Shuffle icon */}
                </div>

                <div className={`repeat-button ${isRepeatOne ? 'active' : ''}`}
                    onClick={() => setIsRepeatOne(!isRepeatOne)}
                    style={{ cursor: 'pointer' }}
                >
                    <FaRedoAlt /> {/* Main repeat icon */}
                </div>

            </div>

            {!isMiniPlayer && (
                <>
                    {/* Search Functionality */}
                    <div className="add-song">
                        <input
                            type="text"
                            placeholder="Search for a song... (S)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={clearSearch} // Clear input and results on focus
                            onKeyDown={(e) => e.key === 'Enter' && searchYouTube()}
                        />
                        <button onClick={searchYouTube}>🔍 Search</button>
                    </div>



                    {/* Display Search Results */}
                    {searchResults.length > 0 && (
                        <div className="search-results" ref={resultsRef}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3>Search Results</h3>
                                <FaTimes onClick={closeSearchResults} style={{ cursor: 'pointer', color: 'red' }} /> {/* Close icon */}
                            </div>
                            {searchResults.map((result, index) => (
                                <div
                                    key={index}
                                    className="search-result-item"
                                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                >
                                    <img src={result.thumbnail} alt={result.title} style={{ width: '100px', height: 'auto', marginRight: '10px' }} />
                                    <span>{result.title}</span>
                                    <button
                                        onClick={() => addSongFromSearch(result)}
                                        className="button" // Apply the button class for styling
                                        style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }} // Flex to align icon and text
                                    >
                                        {addedSongs.has(result.url) ? <FaCheckCircle /> : <FaPlus />} {/* Conditional icon */}
                                        <span style={{ marginLeft: '5px' }}>{addedSongs.has(result.url) ? 'Added' : 'Add'}</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div>
                        <div className="add-song">
                        </div>
                        <Playlist
                            customSongs={customSongs.map((song, index) => ({
                                ...song,
                                title: song.title || `Song #${index + 1}`,
                            }))}
                            jasursList={jasursList}
                            currentVideoIndex={videoTracks.indexOf(currentVideo)}
                            playSelectedVideo={playSelectedVideo}
                            deleteSong={deleteSong}
                            editSong={editSong}
                            setCustomSongs={setCustomSongs}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Player;
