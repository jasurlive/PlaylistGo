import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaTrash } from "react-icons/fa";
import { RxDragHandleHorizontal } from "react-icons/rx";
import { Video } from "./types";

interface SongItemProps {
  track: Video;
  playSelectedVideo: (id: string) => void;
  deleteSong: (id: string) => void;
  currentVideoId: string;
}

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
        isDragging ? "dragging" : ""
      }`}
      onClick={() => playSelectedVideo(track.id)}
    >
      <RxDragHandleHorizontal
        {...listeners}
        className={`drag-handle ${isClicked ? "clicked" : ""}`}
        style={{ touchAction: "none" }}
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
