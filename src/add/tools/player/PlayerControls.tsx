import React, { useEffect } from "react";
import { GrPause, GrPlayFill } from "react-icons/gr";
import { LuRepeat1, LuShuffle } from "react-icons/lu";
import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";
import { PlayerControlsProps } from "../types/interface";

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPauseToggle,
  playNextVideo,
  playPreviousVideo,
  isShuffle,
  setIsShuffle,
  isRepeatOne,
  setIsRepeatOne,
}) => {
  useEffect(() => {
    console.log("PlayerControls mounted");
    const savedShuffle = localStorage.getItem("isShuffle");
    const savedRepeatOne = localStorage.getItem("isRepeatOne");

    if (savedShuffle !== null) {
      setIsShuffle(savedShuffle === "true");
    }
    if (savedRepeatOne !== null) {
      setIsRepeatOne(savedRepeatOne === "true");
    }
  }, [setIsShuffle, setIsRepeatOne]);

  useEffect(() => {
    console.log("isShuffle updated:", isShuffle);
    localStorage.setItem("isShuffle", JSON.stringify(isShuffle));
  }, [isShuffle]);

  useEffect(() => {
    console.log("isRepeatOne updated:", isRepeatOne);
    localStorage.setItem("isRepeatOne", JSON.stringify(isRepeatOne));
  }, [isRepeatOne]);

  return (
    <div className="controls">
      <button
        className={`shuffle-button ${isShuffle ? "active" : ""}`}
        onClick={() => setIsShuffle(!isShuffle)}
      >
        <LuShuffle />
      </button>
      <button onClick={playPreviousVideo}>
        <RxTrackPrevious />
      </button>
      <button onClick={onPlayPauseToggle}>
        {isPlaying ? <GrPause /> : <GrPlayFill />}
      </button>
      <button className="next-button" onClick={playNextVideo}>
        <RxTrackNext />
      </button>
      <button
        className={`repeat-button ${isRepeatOne ? "active" : ""}`}
        onClick={() => setIsRepeatOne(!isRepeatOne)}
      >
        <LuRepeat1 />
      </button>
    </div>
  );
};

export default PlayerControls;
