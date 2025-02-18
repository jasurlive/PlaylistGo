import React, { useState, useRef, useEffect } from 'react';
import { FaPlayCircle, FaPauseCircle, FaForward, FaBackward, FaRandom, FaPlus, FaCheckCircle, FaTimes, FaRedoAlt } from 'react-icons/fa';
import Playlist from './Playlist';
import { generateUniqueId } from './ID';
import './add/css/player.css';
import YTPlayer from './add/YouTube';
import nowPlayingGif from './img/equal_big.gif';
import Shortcuts from './add/Shortcuts';
import * as XLSX from 'xlsx';

const Player = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentVideo, setCurrentVideo] = useState({ id: '', title: '', url: '' });
    const [customSongs, setCustomSongs] = useState([]);
    const [isShuffle, setIsShuffle] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [addedSongs, setAddedSongs] = useState(new Set());
    const [isRepeatOne, setIsRepeatOne] = useState(false);
    const [jasursList, setJasursList] = useState([]);
    const [, setIsVideoPlaying] = useState(false);
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


            if (processedData.length > 0) {
                setCurrentVideo(processedData[0]);
                setIsPlaying(true);
                const player = playerRef.current?.internalPlayer;
                if (player) {
                    player.playVideo();
                }
            }
        } catch (error) {
            console.error('Error fetching or processing playlist Excel file:', error);
        }
    };

    useEffect(() => {
        fetchPlaylist();
    }, []);

    useEffect(() => {
        const savedCustomSongs = localStorage.getItem('customSongs');
        if (savedCustomSongs) {
            setCustomSongs(JSON.parse(savedCustomSongs));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('customSongs', JSON.stringify(customSongs));
    }, [customSongs]);

    const videoTracks = [...customSongs, ...jasursList];

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

    const onPlayPauseToggle = () => {
        const player = playerRef.current?.internalPlayer;
        if (player) {
            if (isPlaying) {
                player.pauseVideo();
                setIsPlaying(false);
            } else {
                player.playVideo();
                setIsPlaying(true);
            }
        }
    };

    const onVideoEnd = () => {
        const player = playerRef.current?.internalPlayer;
        if (player) {
            if (isRepeatOne) {
                player.playVideo();
            } else {
                playNextVideo();
            }
        }
    };

    const playNextVideo = () => {
        let nextVideo;
        if (isShuffle) {
            nextVideo = videoTracks[Math.floor(Math.random() * videoTracks.length)];
        } else {
            const currentIndex = videoTracks.findIndex(video => video.id === currentVideo.id);
            nextVideo = videoTracks[(currentIndex + 1) % videoTracks.length];
        }
        setCurrentVideo(nextVideo);
        setIsPlaying(true);
        const player = playerRef.current?.internalPlayer;
        if (player) {
            player.playVideo();
        }
    };

    const playPreviousVideo = () => {
        const currentIndex = videoTracks.findIndex(video => video.id === currentVideo.id);
        const prevIndex = (currentIndex - 1 + videoTracks.length) % videoTracks.length;
        setCurrentVideo(videoTracks[prevIndex]);
        setIsPlaying(true);
        const player = playerRef.current?.internalPlayer;
        if (player) {
            player.playVideo();
        }
    };

    const playSelectedVideo = (id) => {
        const selectedVideo = videoTracks.find(video => video.id === id);
        if (selectedVideo) {
            setCurrentVideo(selectedVideo);
            setIsPlaying(true);
            setIsVideoPlaying(true);
        }
    };

    const addSongFromSearch = (song) => {
        setCustomSongs((prevSongs) => [{ ...song, id: generateUniqueId() }, ...prevSongs]);
        setAddedSongs((prev) => new Set(prev).add(song.url));
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
                onToggleShuffle={() => setIsShuffle(!isShuffle)}
                onToggleRepeatOne={() => setIsRepeatOne(!isRepeatOne)}
            />
            <h2>
                {isPlaying && <img src={nowPlayingGif} alt="Now Playing" className="now-playing-big-gif" />}
                💽: {currentVideo.title}
            </h2>
            <div className="youtube-container">
                <div className="video-wrapper">
                    <YTPlayer
                        currentVideoId={currentVideo.id}
                        videoTracks={videoTracks}
                        onVideoEnd={onVideoEnd}
                        playerRef={playerRef}
                        autoplay={isPlaying}
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
                <div className={`shuffle-button ${isShuffle ? 'active' : ''}`}
                    onClick={() => setIsShuffle(!isShuffle)}
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
                                style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}
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
                    id: song.id || generateUniqueId(),
                    title: song.title || `Song #${index + 1}`,
                }))}
                jasursList={jasursList.map((song) => ({
                    ...song,
                    id: song.id || generateUniqueId(),
                }))}
                currentVideoId={currentVideo.id}
                playSelectedVideo={playSelectedVideo}
                setCustomSongs={setCustomSongs}
                setJasursList={setJasursList}
            />
        </div>
    );
};

export default Player;
