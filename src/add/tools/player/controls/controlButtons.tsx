import React from "react";
import { GrPause, GrPlayFill } from "react-icons/gr";
import { LuRepeat1, LuShuffle } from "react-icons/lu";
import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";
import "../../../css/buttons.css";

interface ControlButtonsProps {
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
  playNextVideo: () => void;
  playPreviousVideo: () => void;
  isShuffle: boolean;
  setIsShuffle: (value: boolean) => void;
  isRepeatOne: boolean;
  setIsRepeatOne: (value: boolean) => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  isPlaying,
  onPlayPauseToggle,
  playNextVideo,
  playPreviousVideo,
  isShuffle,
  setIsShuffle,
  isRepeatOne,
  setIsRepeatOne,
}) => {
  return (
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
  );
};

export default ControlButtons;
