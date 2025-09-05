import React, { useEffect, useState } from "react";
import { PlayerControlsProps } from "../types/interface";
import "../../css/controls.css";
import Title from "./controls/songTitle";
import TimeBar from "./controls/timeBar";
import ControlButtons from "./controls/controlButtons";
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
  useEffect(() => {
    const savedShuffle = localStorage.getItem("isShuffle");
    const savedRepeatOne = localStorage.getItem("isRepeatOne");
    if (savedShuffle !== null) setIsShuffle(savedShuffle === "true");
    if (savedRepeatOne !== null) setIsRepeatOne(savedRepeatOne === "true");
  }, [setIsShuffle, setIsRepeatOne]);

  useEffect(() => {
    localStorage.setItem("isShuffle", JSON.stringify(isShuffle));
  }, [isShuffle]);

  useEffect(() => {
    localStorage.setItem("isRepeatOne", JSON.stringify(isRepeatOne));
  }, [isRepeatOne]);

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
