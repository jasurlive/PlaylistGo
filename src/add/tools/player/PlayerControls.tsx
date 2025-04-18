import React, { useEffect, useState } from "react";
import { GrPause, GrPlayFill } from "react-icons/gr";
import { LuRepeat1, LuShuffle } from "react-icons/lu";
import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";
import {
  IoVolumeHighSharp,
  IoVolumeMediumSharp,
  IoVolumeLowSharp,
  IoVolumeMute,
} from "react-icons/io5";

import { PlayerControlsProps } from "../types/interface";
import "../../css/controls.css";

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPauseToggle,
  playNextVideo,
  playPreviousVideo,
  isShuffle,
  setIsShuffle,
  isRepeatOne,
  setIsRepeatOne,
  playerRef,
  setIsMuted,
  isMuted,
}) => {
  const [volume, setVolume] = useState(1);

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

  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (playerRef?.current) {
      const internalPlayer = playerRef.current.getInternalPlayer();
      if (internalPlayer && typeof internalPlayer.setVolume === "function") {
        internalPlayer.setVolume(newMuted ? 0 : volume * 100);
      }
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (playerRef?.current) {
      const internalPlayer = playerRef.current.getInternalPlayer();
      if (internalPlayer && typeof internalPlayer.setVolume === "function") {
        internalPlayer.setVolume(newVolume * 100);
      }
    }
    if (isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <div className="controls-container">
      <div className="controls">
        <button
          className={`shuffle-button ${isShuffle ? "active" : ""} #side`}
          id="shuffle"
          onClick={() => setIsShuffle(!isShuffle)}
        >
          <LuShuffle />
        </button>

        <button onClick={playPreviousVideo}>
          <RxTrackPrevious />
        </button>

        <button className="play-pause" onClick={onPlayPauseToggle}>
          {isPlaying ? (
            <GrPause className={`pause-icon ${isPlaying ? "playing" : ""}`} />
          ) : (
            <GrPlayFill className={`play-icon ${isPlaying ? "" : "playing"}`} />
          )}
        </button>

        <button onClick={playNextVideo}>
          <RxTrackNext />
        </button>

        <button
          className={`repeat-button ${isRepeatOne ? "active" : ""} #side`}
          id="repeat"
          onClick={() => setIsRepeatOne(!isRepeatOne)}
        >
          <LuRepeat1 />
        </button>
      </div>

      <div className="volume-container">
        <button
          className="mute-button"
          onClick={handleMuteToggle}
          title={
            isMuted || volume === 0
              ? "Muted"
              : volume <= 0.4
              ? "Low"
              : volume <= 0.8
              ? "Medium"
              : "High"
          }
        >
          {isMuted || volume === 0 ? (
            <IoVolumeMute style={{ color: "#ff4d4f" }} />
          ) : volume <= 0.4 ? (
            <IoVolumeLowSharp style={{ color: "#ffc107" }} />
          ) : volume <= 0.8 ? (
            <IoVolumeMediumSharp style={{ color: "#1e90ff" }} />
          ) : (
            <IoVolumeHighSharp style={{ color: "#02ffb3" }} />
          )}
        </button>

        <div className="volume-control">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
