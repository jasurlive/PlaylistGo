import React, { useState, useEffect } from 'react';
import { FaTrash, FaChevronDown, FaChevronUp, FaMusic, FaThLarge, FaBars } from 'react-icons/fa';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import './add/css/playlist.css';

interface SongItemProps {
    track: { id: string, title: string };
    playSelectedVideo: (id: string) => void;
    deleteSong: (id: string) => void;
    currentVideoId: string;
    viewStyle: string;
}

const SongItem: React.FC<SongItemProps> = ({
    track,
    playSelectedVideo,
    deleteSong,
    currentVideoId,
    viewStyle,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: track.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
        zIndex: isDragging ? 2 : 1,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`song-item ${currentVideoId === track.id ? 'active' : ''}`}
            onClick={() => playSelectedVideo(track.id)}
        >
            <span className="song-title">{track.title}</span>
            {currentVideoId === track.id && <div className="now-playing-gradient" />}
            {viewStyle !== 'cubical-view' && (
                <FaTrash
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteSong(track.id);
                    }}
                    className="icon delete-icon"
                />
            )}
        </li>
    );
};

interface PlaylistSectionProps {
    title: string;
    collapsed: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    icon: React.ReactNode;
    viewStyle: string;
    setViewStyle: (style: string) => void;
}

const PlaylistSection: React.FC<PlaylistSectionProps> = ({
    title,
    collapsed,
    onToggle,
    children,
    icon,
    viewStyle,
    setViewStyle,
}) => {
    return (
        <div className="playlist-section">
            <div className="playlist-header" onClick={onToggle}>
                {icon && <span className="playlist-icon">{icon}</span>}
                <h3>{title}</h3>
                {collapsed ? <FaChevronDown className="toggle-icon" /> : <FaChevronUp className="toggle-icon" />}
            </div>
            {!collapsed && (
                <>
                    <div className="view-toggle">
                        <FaBars
                            className={`view-icon ${viewStyle === 'list-view' ? 'active' : ''}`}
                            onClick={() => setViewStyle('list-view')}
                        />
                        <FaThLarge
                            className={`view-icon ${viewStyle === 'cubical-view' ? 'active' : ''}`}
                            onClick={() => setViewStyle('cubical-view')}
                        />
                    </div>
                    <ul className={`song-list ${viewStyle}`}>{children}</ul>
                </>
            )}
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
    const [customViewStyle, setCustomViewStyle] = useState('cubical-view');
    const [jasursViewStyle, setJasursViewStyle] = useState('list-view');

    useEffect(() => {
        const savedCustomViewStyle = localStorage.getItem('customViewStyle');
        const savedJasursViewStyle = localStorage.getItem('jasursViewStyle');

        if (savedCustomViewStyle) setCustomViewStyle(savedCustomViewStyle);
        if (savedJasursViewStyle) setJasursViewStyle(savedJasursViewStyle);
    }, []);

    useEffect(() => {
        localStorage.setItem('customViewStyle', customViewStyle);
    }, [customViewStyle]);

    useEffect(() => {
        localStorage.setItem('jasursViewStyle', jasursViewStyle);
    }, [jasursViewStyle]);

    const deleteCustomSong = (id: string) => {
        setCustomSongs((prevSongs) => {
            return prevSongs.filter(song => song.id !== id);
        });
    };

    const deleteJasursSong = (id: string) => {
        setJasursList((prevSongs) => {
            return prevSongs.filter(song => song.id !== id);
        });
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 100, // Slightly longer delay to prevent accidental drags
                tolerance: 150, // Increased tolerance for more responsive dragging
            },
        })
    );

    const handleDragEnd = (event: any, setSongs: React.Dispatch<React.SetStateAction<Video[]>>) => {
        const { active, over } = event;

        if (!over) {
            return;
        }

        if (active.id !== over.id) {
            setSongs((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <div className="playlists-container">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(event, setCustomSongs)}
            >
                <SortableContext
                    items={customSongs.map(song => song.id)}
                    strategy={customViewStyle === 'cubical-view' ? rectSortingStrategy : verticalListSortingStrategy}
                >
                    <PlaylistSection
                        title="Your Playlist"
                        collapsed={isCustomCollapsed}
                        onToggle={() => setCustomCollapsed(!isCustomCollapsed)}
                        icon={<FaMusic />}
                        viewStyle={customViewStyle}
                        setViewStyle={setCustomViewStyle}
                    >
                        {customSongs.map((track) => (
                            <SongItem
                                key={track.id}
                                track={track}
                                playSelectedVideo={playSelectedVideo}
                                deleteSong={deleteCustomSong}
                                currentVideoId={currentVideoId}
                                viewStyle={customViewStyle}
                            />
                        ))}
                    </PlaylistSection>
                </SortableContext>
            </DndContext>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(event, setJasursList)}
            >
                <SortableContext
                    items={jasursList.map(song => song.id)}
                    strategy={jasursViewStyle === 'cubical-view' ? rectSortingStrategy : verticalListSortingStrategy}
                >
                    <PlaylistSection
                        title="Random Playlist"
                        collapsed={isJasursCollapsed}
                        onToggle={() => setJasursCollapsed(!isJasursCollapsed)}
                        icon={<FaMusic />}
                        viewStyle={jasursViewStyle}
                        setViewStyle={setJasursViewStyle}
                    >
                        {jasursList.map((track) => (
                            <SongItem
                                key={track.id}
                                track={track}
                                playSelectedVideo={playSelectedVideo}
                                deleteSong={deleteJasursSong}
                                currentVideoId={currentVideoId}
                                viewStyle={jasursViewStyle}
                            />
                        ))}
                    </PlaylistSection>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default Playlist;
