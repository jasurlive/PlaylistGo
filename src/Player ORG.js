import React, { useState, useRef, useEffect } from 'react';
import { FaPlayCircle, FaPauseCircle, FaForward, FaBackward, FaExpand, FaMinus, FaSquare, FaRandom, FaPlus, FaCheckCircle, FaTimes, FaRedoAlt } from 'react-icons/fa';
import Playlist from './Playlist';
import { generateUniqueId } from './ID';
import './add/css/player.css';
import YTPlayer, { extractVideoId } from './add/YouTube';
import nowPlayingGif from './img/equal_big.gif';
import Shortcuts from './add/Shortcuts';
import * as XLSX from 'xlsx';

const Player = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVideo, setCurrentVideo] = useState({ id: '', title: '', url: '' });
    const [isMiniPlayer, setIsMiniPlayer] = useState(false);
    const [customSongs, setCustomSongs] = useState([]);
    const [isShuffle, setIsShuffle] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [addedSongs, setAddedSongs] = useState(new Set());
    const [playedSongs, setPlayedSongs] = useState(new Set());
    const [isRepeatOne, setIsRepeatOne] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [jasursList, setJasursList] = useState([]);
    const playerRef = useRef(null);
    const resultsRef = useRef(null);

    const fetchPlaylist = async () => {
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/songs.xlsx`);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheet = workbook.Sheets["Active"];
            const data = XLSX.utils.sheet_to_json(sheet);

            const processedData = data.slice(0).map((row) => ({
                id: generateUniqueId(),
                title: row["Title"] || 'Untitled',
                url: row["YouTube Link"] || '',
            }));

            setJasursList(processedData);
        } catch (error) {
            console.error('Error fetching or processing playlist Excel file:', error);
        }
    };

    useEffect(() => {
        fetchPlaylist();
    }, []);

    const videoTracks = [...customSongs, ...jasursList];

    useEffect(() => {
        const savedSongs = JSON.parse(localStorage.getItem('customSongs'));
        if (savedSongs) setCustomSongs(savedSongs);
        if (savedSongs?.length === 0 && jasursList.length > 0) {
            setCurrentVideo(jasursList[0]); // Select the first song from jasursList
        }
    }, [jasursList]);

    useEffect(() => {
        localStorage.setItem('customSongs', JSON.stringify(customSongs));
    }, [customSongs]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (resultsRef.current && !resultsRef.current.contains(event.target)) {
                clearSearch();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isFullscreen) {
                toggleFullScreen();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isFullscreen]);

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
            playerRef.current.internalPlayer.playVideo();
        } else {
            playNextVideo();
        }
    };

    const playNextVideo = () => {
        let nextIndex;
        if (isShuffle) {
            const unplayedSongs = videoTracks.filter((_, i) => !playedSongs.has(i));
            if (unplayedSongs.length === 0) {
                setIsPlaying(false);
                setPlayedSongs(new Set());
                return;
            }
            nextIndex = videoTracks.indexOf(unplayedSongs[Math.floor(Math.random() * unplayedSongs.length)]);
            setPlayedSongs((prev) => new Set(prev).add(nextIndex));
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

    const playSelectedVideo = (id) => {
        const selectedVideo = videoTracks.find(video => video.id === id);
        setCurrentVideo(selectedVideo);
        setIsPlaying(true);
        playerRef.current.internalPlayer.loadVideoById(extractVideoId(selectedVideo.url)); // Load and play the video
        if (isShuffle) {
            setPlayedSongs((prev) => new Set(prev).add(id));
        }
    };

    const toggleMiniPlayer = () => {
        setIsMiniPlayer(!isMiniPlayer);
    };

    const toggleFullScreen = () => {
        const playerContainer = document.getElementById('player-container');
        if (!document.fullscreenElement) {
            playerContainer.requestFullscreen().catch((err) => console.log(err));
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const addSongFromSearch = (song) => {
        setCustomSongs((prevSongs) => [{ ...song, id: generateUniqueId() }, ...prevSongs]);
        setAddedSongs((prev) => new Set(prev).add(song.url));
    };

    const deleteSong = (id) => {
        setCustomSongs((prevSongs) => {
            const updatedSongs = prevSongs.filter(song => song.id !== id);
            if (currentVideo.id === id) {
                if (updatedSongs.length > 0) {
                    setCurrentVideo(updatedSongs[0]);
                } else {
                    setCurrentVideo({ id: '', title: '', url: '' });
                    setIsPlaying(false);
                }
            }
            return updatedSongs;
        });

        const songToDelete = customSongs.find(song => song.id === id);
        if (songToDelete) {
            setAddedSongs((prev) => {
                const newSet = new Set(prev);
                newSet.delete(songToDelete.url);
                return newSet;
            });
        }
    };

    const deleteJasursSong = (id) => {
        setJasursList((prevSongs) => {
            const updatedSongs = prevSongs.filter(song => song.id !== id);
            return updatedSongs;
        });
    };

    const searchYouTube = async () => {
        if (!searchQuery) return;

        const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=50&key=${API_KEY}`);
            const data = await response.json();

            if (Array.isArray(data.items)) {
                const results = data.items.map(item => ({
                    id: generateUniqueId(),
                    title: item.snippet.title,
                    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                    thumbnail: item.snippet.thumbnails.default.url
                }));
                setSearchResults(results);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
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
        <div className="music-player" id="player-container">
            <Shortcuts
                onSearchFocus={() => document.querySelector('input[type="text"]').focus()}
                onPlayPauseToggle={onPlayPauseToggle}
                onPlayPrevious={playPreviousVideo}
                onPlayNext={playNextVideo}
                onToggleShuffle={() => {
                    setIsShuffle(!isShuffle);
                    if (!isShuffle) setPlayedSongs(new Set());
                }}
                onToggleFullScreen={toggleFullScreen}
                onToggleRepeatOne={() => setIsRepeatOne(!isRepeatOne)}
            />
            <h2>
                {isPlaying && <img src={nowPlayingGif} alt="Now Playing" className="now-playing-big-gif" />}
                💽: {currentVideo.title}
            </h2>
            <div className={`youtube-container ${isFullscreen ? 'fullscreen' : ''}`}>
                <div className={`video-wrapper${isFullscreen ? 'fullscreen' : ''}`}>
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
                <div className={`shuffle-button ${isShuffle ? 'active' : ''}`}
                    onClick={() => {
                        setIsShuffle(!isShuffle);
                        if (!isShuffle) setPlayedSongs(new Set());
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <FaRandom />
                </div>
                <div className={`repeat-button ${isRepeatOne ? 'active' : ''}`}
                    onClick={() => setIsRepeatOne(!isRepeatOne)}
                    style={{ cursor: 'pointer' }}
                >
                    <FaRedoAlt />
                </div>
            </div>
            {!isMiniPlayer && (
                <>
                    <div className="add-song">
                        <input
                            type="text"
                            placeholder="Search for a song... (S)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={clearSearch}
                            onKeyDown={(e) => e.key === 'Enter' && searchYouTube()}
                        />
                        <button onClick={searchYouTube}>🔍 Search</button>
                    </div>
                    {searchResults.length > 0 && (
                        <div className="search-results" ref={resultsRef}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3>Search Results</h3>
                                <FaTimes onClick={closeSearchResults} style={{ cursor: 'pointer', color: 'red' }} />
                            </div>
                            {searchResults.map((result) => (
                                <div
                                    key={result.id}
                                    className="search-result-item"
                                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                >
                                    <img src={result.thumbnail} alt={result.title} style={{ width: '100px', height: 'auto', marginRight: '10px' }} />
                                    <span>{result.title}</span>
                                    <button
                                        onClick={() => addSongFromSearch(result)}
                                        className="button"
                                        style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}
                                    >
                                        {addedSongs.has(result.url) ? <FaCheckCircle /> : <FaPlus />}
                                        <span style={{ marginLeft: '5px' }}>{addedSongs.has(result.url) ? 'Added' : 'Add'}</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <Playlist
                        customSongs={customSongs.map((song, index) => ({
                            ...song,
                            title: song.title || `Song #${index + 1}`,
                        }))}
                        jasursList={jasursList}
                        currentVideoId={currentVideo.id}
                        playSelectedVideo={playSelectedVideo}
                        deleteSong={deleteSong}
                        deleteJasursSong={deleteJasursSong}
                        setCustomSongs={setCustomSongs}
                        setJasursList={setJasursList}
                    />
                </>
            )}
        </div>
    );
};

export default Player;