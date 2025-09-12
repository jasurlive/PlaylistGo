import React, { useState, useRef, useEffect } from "react";

import { generateUniqueId } from "./add/tools/playlist/fetch/ID"; //giving unique "id"s to songs
import { fetchPlaylist } from "./add/tools/playlist/fetch/fetchPlaylist"; //imports songs from excel sheet

import { usecustomList } from "./add/tools/player/hooks/useCustomSongs"; //loads custom songs from localstorage
import { useYouTubeSearch } from "./add/tools/youtube/hooks/useYouTubeSearch";

import PlayerContent from "./add/tools/player/PlayerContent"; //manages iframe of youtube video
import NavMenu from "./add/tools/basic/NavMenu"; //navbar, playlist toggle, etc.
import SearchBar from "./add/tools/youtube/search/SearchBar";

import PlayerControls from "./add/tools/player/PlayerControls"; //all control buttons, seek bar, etc.
import { usePlayerControls } from "./add/tools/player/hooks/videoControls"; // unified player controls hook (play, pause, next, prev)
import { useSettingsControl } from "./add/tools/player/hooks/useSettingsControl"; // unified settings hook

import "./add/css/player.css";
import "./add/css/header.css";

import { Video } from "./add/tools/types/interface";

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<Video>({
    id: "",
    title: "",
    url: "",
    thumbnail: "",
  });
  const { customList, setcustomList } = usecustomList();
  const [adminList, setadminList] = useState<Video[]>([]);
  const playerRef = useRef<any>(null);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);

  const {
    shuffle: isShuffle,
    repeatOne: isRepeatOne,
    setShuffle: setIsShuffle,
    setRepeatOne: setIsRepeatOne,
  } = useSettingsControl({
    setIsShuffle: () => {},
    setIsRepeatOne: () => {},
  });

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
    fetchPlaylist(setadminList, setCurrentVideo, setIsPlaying, playerRef);
  }, []);

  const videoTracks = [...customList, ...adminList];

  const addSongFromSearch = (song: Video) => {
    setcustomList((prevSongs) => [
      { ...song, id: generateUniqueId() },
      ...prevSongs,
    ]);
    setAddedSongs((prev) => new Set(prev).add(song.url));
  };

  const { togglePlayPause, playNext, playPrevious, playSelected } =
    usePlayerControls(
      videoTracks,
      currentVideo,
      setCurrentVideo,
      isShuffle,
      setIsPlaying,
      playerRef
    );

  const handleSeek = (time: number) => {
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(time);
      setPlayedSeconds(time);
    }
  };

  return (
    <div className="music-player" id="player-container">
      <div className="header-logo" onClick={() => (window.location.href = "/")}>
        {/* beautiful logo */}
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
        setIsPlaying={setIsPlaying} //for play/pause button
        currentVideo={currentVideo} //for handling things around current song
        setCurrentVideo={setCurrentVideo} //for handling things around current song
        videoTracks={videoTracks} //for handling shuffle and next/previous video
        isShuffle={isShuffle} //plays next video randomly if true
        setIsShuffle={setIsShuffle} //handling shuffle
        isRepeatOne={isRepeatOne} //repeats current video if true
        setIsRepeatOne={setIsRepeatOne} //handling repeat one
        playerRef={playerRef} //sync-s states with the player
        setPlayedSeconds={setPlayedSeconds} //tracks current time of song
        setDuration={setDuration} //track song duration
      />

      <PlayerControls // all control buttons, seek bar, etc.
        isPlaying={isPlaying} //for play/pause button
        onPlayPauseToggle={togglePlayPause} // simplified play pause
        playNextVideo={playNext} //next video button
        playPreviousVideo={playPrevious} //previous video button
        isShuffle={isShuffle} //for shuffle button
        setIsShuffle={setIsShuffle} //handling shuffle
        isRepeatOne={isRepeatOne} //for repeat one button
        setIsRepeatOne={setIsRepeatOne} //handling repeat one
        playerRef={playerRef} //sync-s states with the youtube iframe player
        playedSeconds={playedSeconds} //for showin current time of song
        duration={duration} //for showing song duration
        title={currentVideo.title} //for showing current song title
        onSeek={handleSeek} //for handling clicks/touches on seek bar
      />

      <NavMenu //navbar, playlist animation, etc.
        customList={customList}
        adminList={adminList} //displaying admin&user playlists (songs)
        currentVideo={currentVideo} //highlighting current song in playlist
        playSelectedVideo={playSelected} //handling click on song from playlist
        setcustomList={setcustomList} //for drag n drop function for playlists
        setadminList={setadminList} //same as above
      />
    </div>
  );
};

export default Player;
