import React, { useState, useRef, useEffect, forwardRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaTrash } from "react-icons/fa";
import { RxDragHandleHorizontal } from "react-icons/rx";
import { SongItemProps } from "../types/interface";

const LONG_PRESS_DURATION = 500;

// Use forwardRef to allow parent to attach ref to <li>
const SongItem = forwardRef<
  HTMLLIElement,
  SongItemProps & {
    onAddQueue: (id: string) => void;
    onDuplicate: (id: string) => void;
    onGoToCurrent: () => void;
    isCurrentSongVisible: boolean;
  }
>(
  (
    {
      track,
      playSelectedVideo,
      deleteSong,
      currentVideoId,
      onAddQueue,
      onDuplicate,
      onGoToCurrent,
      isCurrentSongVisible,
    },
    ref
  ) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: track.id });

    const [isMouseOnHold, setIsMouseOnHold] = useState(false);
    const [contextMenu, setContextMenu] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on click outside or scroll/resize
    useEffect(() => {
      if (!contextMenu) return;
      const handle = (e: MouseEvent | TouchEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node))
          setContextMenu(null);
      };
      const closeMenu = () => setContextMenu(null);
      window.addEventListener("mousedown", handle);
      window.addEventListener("touchstart", handle);
      window.addEventListener("resize", closeMenu);
      return () => {
        window.removeEventListener("mousedown", handle);
        window.removeEventListener("touchstart", handle);
        window.removeEventListener("resize", closeMenu);
      };
    }, [contextMenu]);

    // Hide menu on drag, play, delete, etc.
    useEffect(() => {
      if (isDragging) setContextMenu(null);
    }, [isDragging]);

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    };

    // Touch and hold for context menu
    const handleTouchStart = (e: React.TouchEvent) => {
      const touch = e.touches[0];
      // Prevent context menu if touching an icon
      const target = e.target as HTMLElement;
      if (target.closest(".trash-icon") || target.closest(".drag-handle")) {
        return;
      }
      setTouchTimer(
        setTimeout(() => {
          setContextMenu({ x: touch.clientX, y: touch.clientY });
        }, LONG_PRESS_DURATION)
      );
    };
    const handleTouchEnd = () => {
      if (touchTimer) clearTimeout(touchTimer);
      setTouchTimer(null);
    };
    // Prevent menu on scroll/move (treat as cancel)
    const handleTouchMove = () => {
      if (touchTimer) clearTimeout(touchTimer);
      setTouchTimer(null);
    };

    // Option actions
    const handlePlayNext = (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      setContextMenu(null);
      onAddQueue(track.id);
    };
    const handleDuplicate = (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      setContextMenu(null);
      onDuplicate(track.id);
    };
    const handleGoToCurrent = (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      setContextMenu(null);
      onGoToCurrent();
    };

    return (
      <>
        <li
          ref={(node) => {
            setNodeRef(node);
            // Forward ref only for current song
            if (ref && currentVideoId === track.id) {
              if (typeof ref === "function") {
                ref(node);
              } else {
                (ref as React.MutableRefObject<HTMLLIElement | null>).current =
                  node;
              }
            }
          }}
          style={{ transform: CSS.Transform.toString(transform), transition }}
          className={`song-item ${
            currentVideoId === track.id ? "active" : ""
          } ${isDragging || isMouseOnHold ? "dragging" : ""}`}
          onClick={() => {
            setContextMenu(null);
            playSelectedVideo?.(track.id);
          }}
          onContextMenu={handleContextMenu}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          tabIndex={0}
        >
          <RxDragHandleHorizontal
            {...listeners}
            className={`drag-handle ${isMouseOnHold ? "clicked" : ""}`}
            style={{ touchAction: "none" }}
            onMouseDown={() => setIsMouseOnHold(true)}
            onMouseUp={() => setIsMouseOnHold(false)}
            onMouseLeave={() => setIsMouseOnHold(false)}
            onTouchStart={() => setIsMouseOnHold(true)}
            onTouchEnd={() => setIsMouseOnHold(false)}
            onTouchCancel={() => setIsMouseOnHold(false)}
            onClick={(e) => e.stopPropagation()}
          />
          <span className="song-title">{track.title}</span>
          {currentVideoId === track.id && (
            <div className="now-playing-gradient" />
          )}
          <FaTrash
            onClick={(e) => {
              e.stopPropagation();
              setContextMenu(null);
              deleteSong(track.id);
            }}
            className="trash-icon"
          />
        </li>
        {contextMenu && (
          <div ref={menuRef} className="song-context-menu">
            <button onClick={handlePlayNext}>Play next</button>
            <button onClick={handleDuplicate}>Duplicate</button>
            <button
              onClick={handleGoToCurrent}
              disabled={isCurrentSongVisible}
              style={isCurrentSongVisible ? { opacity: 0.5 } : {}}
            >
              Go to current song
            </button>
          </div>
        )}
      </>
    );
  }
);

export default SongItem;
