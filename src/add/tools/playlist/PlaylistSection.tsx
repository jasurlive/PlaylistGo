import "../../css/playlist.css";
import React, { useRef } from "react";
import { FaHeadphones } from "react-icons/fa";
import { HiChevronDoubleDown } from "react-icons/hi2";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
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

const PlaylistSection: React.FC<PlaylistSectionProps> = ({
  title,
  songs,
  setSongs,
  currentVideoId,
  playSelectedVideo,
  deleteSong,
}) => {
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

  const handlePlayNext = (id: string) => {
    const idx = songs.findIndex((s) => s.id === id);
    const curIdx = songs.findIndex((s) => s.id === currentVideoId);
    if (idx === -1 || curIdx === -1 || idx === curIdx) return;
    const reordered = [...songs];
    const [song] = reordered.splice(idx, 1);
    reordered.splice(curIdx + 1, 0, song);
    setSongs(reordered);
  };

  const handleDuplicate = (id: string) => {
    const idx = songs.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const song = songs[idx];
    const newSong = { ...song, id: song.id + "_copy_" + Date.now() };
    const newSongs = [...songs];
    newSongs.splice(idx + 1, 0, newSong);
    setSongs(newSongs);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSongs((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
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
                  onAddQueue={handlePlayNext}
                  onDuplicate={handleDuplicate}
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
