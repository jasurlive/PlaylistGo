import React, { useState, useRef, useEffect } from "react";
import { generateUniqueId } from "./add/tools/player/fetch/ID";
import "./add/css/player.css";
import { fetchPlaylist } from "./add/tools/player/fetch/fetchPlaylist";
import { usecustomList } from "./add/tools/player/use/useCustomSongs";
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
  const [currentVideo, setCurrentVideo] = useState<Video>({
    id: "",
    title: "",
    url: "",
    thumbnail: "",
  });
  const { customList, setcustomList } = usecustomList();
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeatOne, setIsRepeatOne] = useState(false);
  const [adminsList, setadminsList] = useState<Video[]>([]);
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
    fetchPlaylist(setadminsList, setCurrentVideo, setIsPlaying, playerRef);
  }, []);

  const videoTracks = [...customList, ...adminsList];

  const addSongFromSearch = (song: Video) => {
    setcustomList((prevSongs) => [
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
      <SearchBar // all youtube search related functions
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchYouTube={searchYouTube}
        searchResults={searchResults}
        addedSongs={addedSongs}
        addSongFromSearch={addSongFromSearch}
        clearSearch={clearSearch}
      />

      <PlayerContent // main player component, video iframe, handling next video on end, updating played songs, etc.
        isPlaying={isPlaying} //for play/pause button
        setIsPlaying={setIsPlaying}
        currentVideo={currentVideo} //for handling things around current song
        setCurrentVideo={setCurrentVideo}
        videoTracks={videoTracks} //for handling shuffle and next/previous video
        isShuffle={isShuffle}
        setIsShuffle={setIsShuffle} //handling shuffle
        isRepeatOne={isRepeatOne}
        setIsRepeatOne={setIsRepeatOne}
        playerRef={playerRef}
        setPlayedSeconds={setPlayedSeconds}
        setDuration={setDuration} //track song duration
      />

      <PlayerControls // all control buttons, seek bar, etc.
        isPlaying={isPlaying} //for play/pause button
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
        onSeek={handleSeek} //for handling clicks/touches on seek bar
      />

      <NavMenu //navbar, playlist animation, etc.
        customList={customList}
        adminsList={adminsList} //displaying admin&user playlists (songs)
        currentVideo={currentVideo}
        playSelectedVideo={handlePlaySelectedVideo} //handling click on song from playlist
        setcustomList={setcustomList} //for drag n drop function for playlists
        setadminsList={setadminsList}
      />
    </div>
  );
};

export default Player;
