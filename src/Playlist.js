import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FaTrash, FaGripVertical, FaChevronDown, FaChevronUp, FaMusic, FaThLarge, FaBars } from 'react-icons/fa';
import './MusicPlayer.css';

const ITEM_TYPE = 'SONG_ITEM';

const SongItem = ({
    track,
    index,
    moveSong,
    playSelectedVideo,
    deleteSong,
    currentVideoIndex,
}) => {
    const [, dragRef] = useDrag({
        type: ITEM_TYPE,
        item: { index },
    });

    const [, dropRef] = useDrop({
        accept: ITEM_TYPE,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveSong(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <li
            ref={(node) => dragRef(dropRef(node))}
            className={`song-item ${currentVideoIndex === index ? 'active' : ''}`}
            onClick={() => playSelectedVideo(index)}
        >
            <FaGripVertical className="drag-icon" />
            <span className="song-title">{track.title}</span>
            {currentVideoIndex === index && <div className="now-playing-gradient" />}
            <FaTrash
                onClick={(e) => {
                    e.stopPropagation();
                    deleteSong(index);
                }}
                className="icon delete-icon"
            />
        </li>
    );
};

const PlaylistSection = ({
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

const Playlist = ({
    customSongs,
    jasursList,
    currentVideoIndex,
    playSelectedVideo,
    deleteSong,
    setCustomSongs,
}) => {
    const [isCustomCollapsed, setCustomCollapsed] = useState(false);
    const [isJasursCollapsed, setJasursCollapsed] = useState(false);
    const [customViewStyle, setCustomViewStyle] = useState('list-view');
    const [jasursViewStyle, setJasursViewStyle] = useState('list-view');

    // Load view styles from localStorage on component mount
    useEffect(() => {
        const savedCustomViewStyle = localStorage.getItem('customViewStyle');
        const savedJasursViewStyle = localStorage.getItem('jasursViewStyle');

        if (savedCustomViewStyle) setCustomViewStyle(savedCustomViewStyle);
        if (savedJasursViewStyle) setJasursViewStyle(savedJasursViewStyle);
    }, []);

    // Save custom view style to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('customViewStyle', customViewStyle);
    }, [customViewStyle]);

    // Save Jasur's view style to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('jasursViewStyle', jasursViewStyle);
    }, [jasursViewStyle]);

    const moveSong = (dragIndex, hoverIndex) => {
        setCustomSongs((prevSongs) => {
            const updatedSongs = [...prevSongs];
            const [movedSong] = updatedSongs.splice(dragIndex, 1);
            updatedSongs.splice(hoverIndex, 0, movedSong);
            return updatedSongs;
        });
    };

    return (
        <div className="playlists-container">
            <PlaylistSection
                title="Your Playlist"
                collapsed={isCustomCollapsed}
                onToggle={() => setCustomCollapsed(!isCustomCollapsed)}
                icon={<FaMusic />}
                viewStyle={customViewStyle}
                setViewStyle={setCustomViewStyle}
            >
                {customSongs.map((track, index) => (
                    <SongItem
                        key={index}
                        track={track}
                        index={index}
                        moveSong={moveSong}
                        playSelectedVideo={playSelectedVideo}
                        deleteSong={deleteSong}
                        currentVideoIndex={currentVideoIndex}
                    />
                ))}
            </PlaylistSection>

            <PlaylistSection
                title="Random Playlist"
                collapsed={isJasursCollapsed}
                onToggle={() => setJasursCollapsed(!isJasursCollapsed)}
                icon={<FaMusic />}
                viewStyle={jasursViewStyle}
                setViewStyle={setJasursViewStyle}
            >
                {jasursList.map((track, index) => (
                    <li
                        key={index}
                        className={`song-item ${currentVideoIndex === customSongs.length + index ? 'active' : ''}`}
                        onClick={() => playSelectedVideo(customSongs.length + index)}
                    >
                        {track.title}
                    </li>
                ))}
            </PlaylistSection>
        </div>
    );
};

export default Playlist;
