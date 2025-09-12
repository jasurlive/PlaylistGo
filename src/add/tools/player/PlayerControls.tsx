import React, { useEffect, useState } from "react";
import { PlayerControlsProps } from "../types/interface";
import "../../css/buttons.css";
import Title from "./components/songTitle";
import TimeBar from "./components/timeBar";
import ControlButtons from "./components/controlButtons";

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
  // -------------------------------
  // Fullscreen logic
  // -------------------------------
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullScreen(true))
        .catch((err) => console.error("Failed to set fullscreen:", err));
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullScreen(false))
        .catch((err) => console.error("Failed to exit fullscreen:", err));
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

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
