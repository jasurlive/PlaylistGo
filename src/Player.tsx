import React, { useState, useRef, useEffect } from "react";
import { generateUniqueId } from "./add/tools/player/ID";
import "./add/css/player.css";
import nowPlayingGif from "./add/img/icons/equal_big.gif";
import { fetchPlaylist } from "./add/tools/player/fetchPlaylist";
import { useCustomSongs } from "./add/tools/player/useCustomSongs";
import { useYouTubeSearch } from "./add/tools/youtube/useYouTubeSearch";
import { Video } from "./add/tools/types/video";
import PlayerContent from "./add/tools/player/PlayerContent";
import NavMenu from "./add/tools/basic/NavMenu";

import SearchBar from "./add/tools/player/SearchBar";
import Online from "./add/tools/basic/Online";

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
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

  return (
    <div className="music-player" id="player-container">
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
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        searchYouTube={searchYouTube}
        clearSearch={clearSearch}
        addedSongs={addedSongs}
        addSongFromSearch={addSongFromSearch}
        customSongs={customSongs}
        jasursList={jasursList}
        setCustomSongs={setCustomSongs}
        setJasursList={setJasursList}
      />

      <h2>
        {isPlaying && (
          <img
            src={nowPlayingGif}
            alt="Now Playing"
            className="now-playing-big-gif"
          />
        )}
        💽: {currentVideo.title}
      </h2>

      <Online />

      <NavMenu
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        searchYouTube={searchYouTube}
        clearSearch={clearSearch}
        addedSongs={addedSongs}
        addSongFromSearch={addSongFromSearch}
        customSongs={customSongs}
        jasursList={jasursList}
        setCustomSongs={setCustomSongs}
        setJasursList={setJasursList}
        currentVideo={currentVideo}
        playSelectedVideo={handlePlaySelectedVideo}
      />
    </div>
  );
};

export default Player;
