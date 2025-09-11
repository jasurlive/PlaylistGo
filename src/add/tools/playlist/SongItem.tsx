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
    onAction: (action: "playNext" | "duplicate", id: string) => void; // ✅ all in one
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
      onAction, // ✅ right click handler
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
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setContextMenu(null);
        }
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

    // Hide menu on drag
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
      const target = e.target as HTMLElement;

      // Prevent context menu if touching an icon
      if (target.closest(".trash-icon") || target.closest(".drag-handle"))
        return;

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
    const handleTouchMove = () => {
      if (touchTimer) clearTimeout(touchTimer);
      setTouchTimer(null);
    };

    // ✅ Context menu option actions (unified)
    const handleOptionClick = (
      e: React.MouseEvent | React.TouchEvent,
      action: "playNext" | "duplicate" | "goToCurrent"
    ) => {
      e.stopPropagation();
      setContextMenu(null);

      if (action === "goToCurrent") {
        onGoToCurrent();
      } else {
        onAction(action, track.id);
      }
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

        {/* ✅ Custom right-click / long-press menu */}
        {contextMenu && (
          <div ref={menuRef} className="song-context-menu">
            <button onClick={(e) => handleOptionClick(e, "playNext")}>
              Play next
            </button>
            <button onClick={(e) => handleOptionClick(e, "duplicate")}>
              Duplicate
            </button>
            <button
              onClick={(e) => handleOptionClick(e, "goToCurrent")}
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
