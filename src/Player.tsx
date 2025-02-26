import React, { useState, useRef, useEffect } from 'react';
import Playlist from './Playlist';
import { generateUniqueId } from './add/tools/player/ID';
import './add/css/player.css';
import YTPlayer from './add/tools/youtube/YouTube';
import nowPlayingGif from './add/img/icons/equal_big.gif';
import Shortcuts from './add/tools/player/Shortcuts';
import PlayerControls from './add/tools/player/PlayerControls';
import SearchBar from './add/tools/player/SearchBar';
import { fetchPlaylist } from './add/tools/player/fetchPlaylist';
import { useCustomSongs } from './add/tools/player/useCustomSongs';
import { playNextVideo, playPreviousVideo, playSelectedVideo } from './add/tools/player/videoControls';

interface Video {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
}

const Player: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentVideo, setCurrentVideo] = useState<Video>({ id: '', title: '', url: '', thumbnail: '' });
    const { customSongs, setCustomSongs } = useCustomSongs();
    const [isShuffle, setIsShuffle] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Video[]>([]);
    const [addedSongs, setAddedSongs] = useState(new Set<string>());
    const [isRepeatOne, setIsRepeatOne] = useState(false);
    const [jasursList, setJasursList] = useState<Video[]>([]);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        fetchPlaylist(setJasursList, setCurrentVideo, setIsPlaying, playerRef);
    }, []);

    const videoTracks = [...customSongs, ...jasursList];

    const addSongFromSearch = (song: Video) => {
        setCustomSongs((prevSongs) => [{ ...song, id: generateUniqueId() }, ...prevSongs]);
        setAddedSongs((prev) => new Set(prev).add(song.url));
    };

    const searchYouTube = async () => {
        if (!searchQuery) return;

        const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=50&key=${API_KEY}`);
            const data = await response.json();

            if (Array.isArray(data.items)) {
                const results = data.items.map((item: any) => ({
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

    const handlePlayPauseToggle = () => {
        if (playerRef.current) {
            const playerState = playerRef.current.getPlayerState();
            if (playerState === 1) {
                playerRef.current.pauseVideo();
                setIsPlaying(false);
            } else {
                playerRef.current.playVideo();
                setIsPlaying(true);
            }
        }
    };

    const toggleFullScreen = () => {
        if (playerRef.current) {
            playerRef.current.getIframe().contentWindow.postMessage(
                JSON.stringify({
                    event: 'command',
                    func: 'fullscreen',
                    args: []
                }),
                '*'
            );
        }
    };

    const onVideoEndHandler = () => {
        if (isRepeatOne) {
            playerRef.current.seekTo(0);
            playerRef.current.playVideo();
        } else {
            playNextVideo(videoTracks, currentVideo, setCurrentVideo, setIsPlaying, isShuffle, playerRef);
        }
    };

    return (
        <div className="music-player" id="player-container">
            <Shortcuts
                onSearchFocus={() => (document.querySelector('input[type="text"]') as HTMLInputElement)?.focus()}
                onPlayPauseToggle={handlePlayPauseToggle}
                onPlayPrevious={() => playPreviousVideo(videoTracks, currentVideo, setCurrentVideo, setIsPlaying, playerRef)}
                onPlayNext={() => playNextVideo(videoTracks, currentVideo, setCurrentVideo, setIsPlaying, isShuffle, playerRef)}
                onToggleShuffle={() => setIsShuffle(!isShuffle)}
                onToggleRepeatOne={() => setIsRepeatOne(!isRepeatOne)}
                onToggleFullScreen={toggleFullScreen}
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
                        onVideoEnd={onVideoEndHandler}
                        playerRef={playerRef}
                        autoplay={isPlaying}
                    />
                </div>

                <PlayerControls
                    isPlaying={isPlaying}
                    onPlayPauseToggle={handlePlayPauseToggle}
                    playNextVideo={() => playNextVideo(videoTracks, currentVideo, setCurrentVideo, setIsPlaying, isShuffle, playerRef)}
                    playPreviousVideo={() => playPreviousVideo(videoTracks, currentVideo, setCurrentVideo, setIsPlaying, playerRef)}
                    isShuffle={isShuffle}
                    setIsShuffle={setIsShuffle}
                    isRepeatOne={isRepeatOne}
                    setIsRepeatOne={setIsRepeatOne}
                /></div>
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchYouTube={searchYouTube}
                searchResults={searchResults}
                addedSongs={addedSongs}
                addSongFromSearch={addSongFromSearch}
                clearSearch={clearSearch}
            />
            <Playlist
                customSongs={customSongs.map((song, index) => ({
                    ...song,
                    id: song.id || generateUniqueId(),
                    title: song.title || `Song #${index + 1}`,
                    thumbnail: song.thumbnail || ''
                }))}
                jasursList={jasursList.map((song) => ({
                    ...song,
                    id: song.id || generateUniqueId(),
                    thumbnail: song.thumbnail || ''
                }))}
                currentVideoId={currentVideo.id}
                playSelectedVideo={(id: string) => playSelectedVideo(id, videoTracks, setCurrentVideo, setIsPlaying)}
                setCustomSongs={setCustomSongs}
                setJasursList={setJasursList}
            />
        </div>
    );
};

export default Player;
