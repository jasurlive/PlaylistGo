import React, { useState, useRef, useEffect } from "react";
import { generateUniqueId } from "./add/tools/player/ID";
import "./add/css/player.css";
import nowPlayingGif from "./add/img/icons/equal_big.gif";
import { fetchPlaylist } from "./add/tools/player/fetchPlaylist";
import { useCustomSongs } from "./add/tools/player/useCustomSongs";
import { useYouTubeSearch } from "./add/tools/youtube/useYouTubeSearch";
import { Video } from "./add/tools/playlist/types";
import PlayerContent from "./add/tools/player/PlayerContent";

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

  return (
    <div className="music-player" id="player-container">
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
    </div>
  );
};

export default Player;
