import React from "react";
import Shortcuts from "./Shortcuts";
import YouTubeContainer from "../youtube/YouTubeContainer";
import { PlayerContentProps } from "../types/interface";
import {
  playNextVideo,
  playPreviousVideo,
  playSelectedVideo,
} from "./videoControls";

const PlayerContent: React.FC<PlayerContentProps> = ({
  isPlaying,
  setIsPlaying,
  currentVideo,
  setCurrentVideo,
  videoTracks,
  isShuffle,
  setIsShuffle,
  isRepeatOne,
  setIsRepeatOne,
  playerRef,
  searchQuery,
  setSearchQuery,
  searchResults,
  searchYouTube,
  clearSearch,
  addedSongs,
  addSongFromSearch,
  customSongs,
  jasursList,
  setCustomSongs,
  setJasursList,
}) => {
  const handlePlayPauseToggle = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <>
      <Shortcuts
        onSearchFocus={() =>
          (
            document.querySelector('input[type="text"]') as HTMLInputElement
          )?.focus()
        }
        onPlayPauseToggle={handlePlayPauseToggle}
        onPlayPrevious={() =>
          playPreviousVideo(
            videoTracks,
            currentVideo,
            setCurrentVideo,
            setIsPlaying,
            playerRef
          )
        }
        onPlayNext={() =>
          playNextVideo(
            videoTracks,
            currentVideo,
            setCurrentVideo,
            setIsPlaying,
            isShuffle,
            playerRef
          )
        }
        onToggleShuffle={() => setIsShuffle(!isShuffle)}
        onToggleRepeatOne={() => setIsRepeatOne(!isRepeatOne)}
      />
      <YouTubeContainer
        currentVideo={currentVideo}
        videoTracks={videoTracks}
        isPlaying={isPlaying}
        isShuffle={isShuffle}
        isRepeatOne={isRepeatOne}
        setIsPlaying={setIsPlaying}
        setIsShuffle={setIsShuffle}
        setIsRepeatOne={setIsRepeatOne}
        setCurrentVideo={setCurrentVideo}
        playerRef={playerRef}
      />
    </>
  );
};

export default PlayerContent;
