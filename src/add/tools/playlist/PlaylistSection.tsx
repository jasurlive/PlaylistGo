import "../../css/playlist.css";
import React, { useRef } from "react";
import { FaHeadphones } from "react-icons/fa";
import { HiChevronDoubleDown } from "react-icons/hi2";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import SongItem from "./SongItem";
import { PlaylistSectionProps } from "../types/interface";
import { useHandleRightClick } from "./hooks/handleRightClick";

const PlaylistSection: React.FC<PlaylistSectionProps> = ({
  title,
  songs,
  setSongs,
  currentVideoId,
  playSelectedVideo,
  deleteSong,
}) => {
  // ✅ use reusable hook
  const { handleSongAction } = useHandleRightClick(
    songs,
    setSongs,
    currentVideoId
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 150 },
    })
  );

  const currentSongRef = useRef<HTMLLIElement>(null);

  const scrollToCurrentSong = () => {
    if (currentSongRef.current) {
      currentSongRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const isCurrentSongVisible = () => {
    if (!currentSongRef.current) return false;
    const rect = currentSongRef.current.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    handleSongAction("reorder", { activeId: active.id, overId: over?.id });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={songs.map((song) => song.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="playlist-section">
          <div className="playlist-header">
            <FaHeadphones />
            {title}
            <HiChevronDoubleDown />
          </div>

          {songs.length === 0 ? (
            <div className="no-songs-message">
              <p>Empty playlist</p>
              <br />
              You can add songs using search 🔎🎧
              <br />
              <br />
              <p>Enjoy! 🙂‍↔️🙂‍↕️🎸🎛️</p>
              <br />
            </div>
          ) : (
            <ul className="song-list">
              {songs.map((track) => (
                <SongItem
                  key={track.id}
                  track={track}
                  playSelectedVideo={playSelectedVideo}
                  deleteSong={deleteSong}
                  currentVideoId={currentVideoId}
                  onAction={handleSongAction}
                  onGoToCurrent={scrollToCurrentSong}
                  isCurrentSongVisible={isCurrentSongVisible()}
                  ref={track.id === currentVideoId ? currentSongRef : undefined}
                />
              ))}
            </ul>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default PlaylistSection;
