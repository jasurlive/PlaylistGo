import React, { useEffect, useState } from "react";
import { PlayerControlsProps } from "../types/interface";
import "../../css/buttons.css";
import Title from "./components/songTitle";
import TimeBar from "./components/timeBar";
import ControlButtons from "./components/controlButtons";
import { useFullScreen } from "./hooks/useFullScreen";

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPauseToggle,
  playNextVideo,
  playPreviousVideo,
  isShuffle,
  setIsShuffle,
  isRepeatOne,
  setIsRepeatOne,
  title,
  playedSeconds,
  duration,
  onSeek,
}) => {
  // Fullscreen hook
  const { isFullScreen, toggleFullScreen } = useFullScreen();

  return (
    <div className="controls-container">
      <TimeBar
        playedSeconds={playedSeconds}
        duration={duration}
        onSeek={onSeek}
      />
      <Title title={title} isPlaying={isPlaying} />
      <ControlButtons
        isPlaying={isPlaying}
        onPlayPauseToggle={onPlayPauseToggle}
        playNextVideo={playNextVideo}
        playPreviousVideo={playPreviousVideo}
        isShuffle={isShuffle}
        setIsShuffle={setIsShuffle}
        isRepeatOne={isRepeatOne}
        setIsRepeatOne={setIsRepeatOne}
        isFullScreen={isFullScreen}
        setIsFullScreen={toggleFullScreen}
      />
    </div>
  );
};

export default PlayerControls;
