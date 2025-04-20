import React from "react";
import "../../../css/timebar.css";

interface TimeBarProps {
  playedSeconds: number;
  duration: number;
  onSeek: (time: number) => void;
}

const TimeBar: React.FC<TimeBarProps> = ({
  playedSeconds,
  duration,
  onSeek,
}) => {
  const calculateProgress = () => {
    return duration > 0 ? (playedSeconds / duration) * 100 : 0;
  };

  const handleSeek = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newProgress = clickX / rect.width;
    const newTime = newProgress * duration;
    onSeek(newTime);
  };

  return (
    <div className="time-bar-container">
      <div className="timing-bar" onClick={handleSeek}>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
          <div
            className="seek-cursor"
            style={{ left: `${calculateProgress()}%` }}
          ></div>
        </div>
      </div>
      <div className="timing-info">
        <span>
          {Math.floor(playedSeconds / 60)}:
          {Math.floor(playedSeconds % 60)
            .toString()
            .padStart(2, "0")}
        </span>
        <span>
          {Math.floor(duration / 60)}:
          {Math.floor(duration % 60)
            .toString()
            .padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

export default TimeBar;
