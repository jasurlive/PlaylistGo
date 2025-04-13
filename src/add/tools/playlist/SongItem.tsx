import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaTrash } from "react-icons/fa";
import { RxDragHandleHorizontal } from "react-icons/rx";
import { SongItemProps } from "../types/interface";

const SongItem: React.FC<SongItemProps> = ({
  track,
  playSelectedVideo,
  deleteSong,
  currentVideoId,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id });

  const [isMouseOnHold, setIsMouseOnHold] = useState(false);

  const [isClicked, setIsClicked] = useState(false);

  const handleDragHandleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClicked((prev) => !prev);
  };

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`song-item ${currentVideoId === track.id ? "active" : ""} ${
        isDragging || isMouseOnHold ? "dragging" : ""
      }`}
      onClick={() => playSelectedVideo(track.id)}
    >
      <RxDragHandleHorizontal
        {...listeners}
        className={`drag-handle ${isMouseOnHold ? "clicked" : ""}`}
        style={{ touchAction: "none" }}
        onMouseDown={() => setIsMouseOnHold(true)}
        onMouseUp={() => setIsMouseOnHold(false)}
        onTouchStart={() => setIsMouseOnHold(true)}
        onTouchEnd={() => setIsMouseOnHold(false)}
        onClick={handleDragHandleClick}
      />
      <span className="song-title">{track.title}</span>
      {currentVideoId === track.id && <div className="now-playing-gradient" />}
      <FaTrash
        onClick={(e) => {
          e.stopPropagation();
          deleteSong(track.id);
        }}
        className="trash-icon"
      />
    </li>
  );
};

export default SongItem;
