import "../../css/playlist.css";
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
import { Video } from "../types/video";

interface PlaylistSectionProps {
  title: string;
  songs: Video[];
  setSongs: React.Dispatch<React.SetStateAction<Video[]>>;
  currentVideoId: string;
  playSelectedVideo: (id: string) => void;
  deleteSong: (id: string) => void;
}

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
          <ul className="song-list">
            {songs.map((track) => (
              <SongItem
                key={track.id}
                track={track}
                playSelectedVideo={playSelectedVideo}
                deleteSong={deleteSong}
                currentVideoId={currentVideoId}
              />
            ))}
          </ul>
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default PlaylistSection;
