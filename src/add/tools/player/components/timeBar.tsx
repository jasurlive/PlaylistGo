import React, { useRef, useState } from "react";
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
  // State to track dragging and preview time
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const calculateProgress = () => {
    return duration > 0 ? (playedSeconds / duration) * 100 : 0;
  };

  // Helper to get time from event (mouse or touch)
  const getTimeFromEvent = (
    e: MouseEvent | TouchEvent,
    rect: DOMRect
  ): number => {
    let clientX: number;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const progress = x / rect.width;
    return Math.max(0, Math.min(duration, progress * duration));
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    setIsDragging(true);
    const rect = progressBarRef.current.getBoundingClientRect();
    const time = getTimeFromEvent(e.nativeEvent, rect);
    setDragTime(time);
    onSeek(time);

    // Attach listeners to window for smooth drag
    const onMove = (moveEvent: MouseEvent) => {
      const time = getTimeFromEvent(moveEvent, rect);
      setDragTime(time);
      onSeek(time);
    };
    const onUp = () => {
      setIsDragging(false);
      setDragTime(null);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    setIsDragging(true);
    const rect = progressBarRef.current.getBoundingClientRect();
    const time = getTimeFromEvent(e.nativeEvent, rect);
    setDragTime(time);
    onSeek(time);

    const onMove = (moveEvent: TouchEvent) => {
      const time = getTimeFromEvent(moveEvent, rect);
      setDragTime(time);
      onSeek(time);
    };
    const onEnd = () => {
      setIsDragging(false);
      setDragTime(null);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);
    window.addEventListener("touchcancel", onEnd);
  };

  // Progress for bar/cursor: use dragTime if dragging, else playedSeconds
  const progressPercent =
    duration > 0
      ? ((isDragging && dragTime !== null ? dragTime : playedSeconds) /
          duration) *
        100
      : 0;

  return (
    <div className="time-bar-container">
      <div className="timing-bar">
        <div
          className="progress-bar"
          ref={progressBarRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div
            className="progress"
            style={{ width: `${progressPercent}%` }}
          ></div>
          <div
            className="seek-cursor"
            style={{ left: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
      <div className="timing-info">
        <span>
          {Math.floor(
            (isDragging && dragTime !== null ? dragTime : playedSeconds) / 60
          )}
          :
          {Math.floor(
            (isDragging && dragTime !== null ? dragTime : playedSeconds) % 60
          )
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
