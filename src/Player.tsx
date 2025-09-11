import React, { useState, useRef, useEffect } from "react";
import { generateUniqueId } from "./add/tools/player/fetch/ID";
import "./add/css/player.css";
import { fetchPlaylist } from "./add/tools/player/fetch/fetchPlaylist";
import { useCustomSongs } from "./add/tools/player/use/useCustomSongs";
import { useYouTubeSearch } from "./add/tools/youtube/useYouTubeSearch";
import { Video } from "./add/tools/types/interface";
import PlayerContent from "./add/tools/player/PlayerContent";
import NavMenu from "./add/tools/basic/NavMenu";
import SearchBar from "./add/tools/player/search/SearchBar";
import PlayerControls from "./add/tools/player/PlayerControls";
import "./add/css/header.css";
import {
  playNextVideo,
  playPreviousVideo,
} from "./add/tools/player/videoControls";

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video>({
    id: "",
    title: "",
    url: "",
    thumbnail: "",
  });
  const { customSongs, setCustomSongs } = useCustomSongs();
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeatOne, setIsRepeatOne] = useState(false);
  const [jasursList, setJasursList] = useState<Video[]>([]);
  const playerRef = useRef<any>(null);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchYouTube,
    clearSearch,
    addedSongs,
    setAddedSongs,
  } = useYouTubeSearch();

  useEffect(() => {
    fetchPlaylist(setJasursList, setCurrentVideo, setIsPlaying, playerRef);
  }, []);

  const videoTracks = [...customSongs, ...jasursList];

  const addSongFromSearch = (song: Video) => {
    setCustomSongs((prevSongs) => [
      { ...song, id: generateUniqueId() },
      ...prevSongs,
    ]);
    setAddedSongs((prev) => new Set(prev).add(song.url));
  };

  const handlePlaySelectedVideo = (id: string) => {
    const selectedVideo = videoTracks.find((video) => video.id === id);
    if (selectedVideo) {
      setCurrentVideo(selectedVideo);
      setIsPlaying(true);
    }
  };

  const handlePlayPauseToggle = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleSeek = (time: number) => {
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(time);
      setPlayedSeconds(time);
    }
  };

  return (
    <div className="music-player" id="player-container">
      <div className="header-logo" onClick={() => (window.location.href = "/")}>
        <div className="logo-text">🎧 playlistgo.vercel.app ツ🖤</div>
      </div>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchYouTube={searchYouTube}
        searchResults={searchResults}
        addedSongs={addedSongs}
        addSongFromSearch={addSongFromSearch}
        clearSearch={clearSearch}
      />

      <PlayerContent
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentVideo={currentVideo}
        setCurrentVideo={setCurrentVideo}
        videoTracks={videoTracks}
        isShuffle={isShuffle}
        setIsShuffle={setIsShuffle}
        isRepeatOne={isRepeatOne}
        setIsRepeatOne={setIsRepeatOne}
        playerRef={playerRef}
        setPlayedSeconds={setPlayedSeconds}
        setDuration={setDuration}
      />

      <PlayerControls
        isPlaying={isPlaying}
        onPlayPauseToggle={handlePlayPauseToggle}
        playNextVideo={() =>
          playNextVideo(
            videoTracks,
            currentVideo,
            setCurrentVideo,
            setIsPlaying,
            isShuffle,
            playerRef
          )
        }
        playPreviousVideo={() =>
          playPreviousVideo(
            videoTracks,
            currentVideo,
            setCurrentVideo,
            setIsPlaying,
            playerRef
          )
        }
        isShuffle={isShuffle}
        setIsShuffle={setIsShuffle}
        isRepeatOne={isRepeatOne}
        setIsRepeatOne={setIsRepeatOne}
        playerRef={playerRef}
        playedSeconds={playedSeconds}
        duration={duration}
        title={currentVideo.title}
        onSeek={handleSeek}
      />

      <NavMenu
        customSongs={customSongs}
        jasursList={jasursList}
        currentVideo={currentVideo}
        playSelectedVideo={handlePlaySelectedVideo}
        setCustomSongs={setCustomSongs}
        setJasursList={setJasursList}
      />
    </div>
  );
};

export default Player;
