import { useState } from "react";
import { FaTrash, FaChevronDown, FaChevronUp, FaMusic } from "react-icons/fa";
import { RxDragHandleHorizontal } from "react-icons/rx";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import "./add/css/playlist.css";
import { useSortable, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

interface SongItemProps {
  track: { id: string; title: string };
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

  const dragHandleStyle = {
    touchAction: "none",
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`song-item ${currentVideoId === track.id ? "active" : ""} ${
        isDragging ? "dragging" : ""
      }`}
      onClick={() => playSelectedVideo(track.id)}
    >
      <RxDragHandleHorizontal
        {...listeners}
        className="drag-handle"
        style={dragHandleStyle}
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

interface PlaylistSectionProps {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const PlaylistSection: React.FC<PlaylistSectionProps> = ({
  title,
  collapsed,
  onToggle,
  children,
  icon,
}) => {
  return (
    <div className="playlist-section">
      <div className="playlist-header" onClick={onToggle}>
        {icon && <span className="playlist-icon">{icon}</span>}
        <h3>{title}</h3>
        {collapsed ? (
          <FaChevronDown className="toggle-icon" />
        ) : (
          <FaChevronUp className="toggle-icon" />
        )}
      </div>
      {!collapsed && <ul className="song-list">{children}</ul>}
    </div>
  );
};

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
}

interface PlaylistProps {
  customSongs: Video[];
  jasursList: Video[];
  currentVideoId: string;
  playSelectedVideo: (id: string) => void;
  setCustomSongs: React.Dispatch<React.SetStateAction<Video[]>>;
  setJasursList: React.Dispatch<React.SetStateAction<Video[]>>;
}

const Playlist: React.FC<PlaylistProps> = ({
  customSongs,
  jasursList,
  currentVideoId,
  playSelectedVideo,
  setCustomSongs,
  setJasursList,
}) => {
  const [isCustomCollapsed, setCustomCollapsed] = useState(false);
  const [isJasursCollapsed, setJasursCollapsed] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 150 },
    })
  );

  const handleDragEnd = (
    event: any,
    setSongs: React.Dispatch<React.SetStateAction<Video[]>>
  ) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSongs((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const deleteSong = (id: string, isCustom: boolean) => {
    if (isCustom) {
      setCustomSongs((prevSongs) => prevSongs.filter((song) => song.id !== id));
    } else {
      setJasursList((prevSongs) => prevSongs.filter((song) => song.id !== id));
    }
  };

  const renderPlaylist = (songs: Video[], isCustom: boolean) => {
    const toggleCollapse = isCustom ? setCustomCollapsed : setJasursCollapsed;
    const collapsed = isCustom ? isCustomCollapsed : isJasursCollapsed;
    const setSongs = isCustom ? setCustomSongs : setJasursList;

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd(event, setSongs)}
      >
        <SortableContext
          items={songs.map((song) => song.id)}
          strategy={verticalListSortingStrategy}
        >
          <PlaylistSection
            title={isCustom ? "Your Playlist" : "Random Playlist"}
            collapsed={collapsed}
            onToggle={() => toggleCollapse(!collapsed)}
            icon={<FaMusic />}
          >
            {songs.map((track) => (
              <SongItem
                key={track.id}
                track={track}
                playSelectedVideo={playSelectedVideo}
                deleteSong={(id: string) => deleteSong(id, isCustom)}
                currentVideoId={currentVideoId}
              />
            ))}
          </PlaylistSection>
        </SortableContext>
      </DndContext>
    );
  };

  return (
    <div className="playlists-container">
      {renderPlaylist(customSongs, true)}
      {renderPlaylist(jasursList, false)}
    </div>
  );
};

export default Playlist;
