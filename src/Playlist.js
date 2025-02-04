import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FaTrash, FaChevronDown, FaChevronUp, FaMusic, FaThLarge, FaBars } from 'react-icons/fa';
import './add/css/playlist.css';

const ITEM_TYPE = 'SONG_ITEM';

const SongItem = ({
    track,
    index,
    moveSong,
    playSelectedVideo,
    deleteSong,
    currentVideoIndex,
    viewStyle,
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

            <span className="song-title">{track.title}</span>
            {currentVideoIndex === index && <div className="now-playing-gradient" />}
            {viewStyle !== 'cubical-view' && (
                <FaTrash
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteSong(index);
                    }}
                    className="icon delete-icon"
                />
            )}
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

    const moveSong = (dragIndex, hoverIndex, listType) => {
        if (listType === 'custom') {
            setCustomSongs((prevSongs) => {
                const updatedSongs = [...prevSongs];
                const [movedSong] = updatedSongs.splice(dragIndex, 1);
                updatedSongs.splice(hoverIndex, 0, movedSong);
                return updatedSongs;
            });
        } else {
            setJasursList((prevSongs) => {
                const updatedSongs = [...prevSongs];
                const [movedSong] = updatedSongs.splice(dragIndex, 1);
                updatedSongs.splice(hoverIndex, 0, movedSong);
                return updatedSongs;
            });
        }
    };

    const deleteJasursSong = (index) => {
        setJasursList((prevSongs) => {
            const updatedSongs = prevSongs.filter((_, i) => i !== index);
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
                        moveSong={(dragIndex, hoverIndex) => moveSong(dragIndex, hoverIndex, 'custom')}
                        playSelectedVideo={playSelectedVideo}
                        deleteSong={deleteSong}
                        currentVideoIndex={currentVideoIndex}
                        viewStyle={customViewStyle}
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
                    <SongItem
                        key={index}
                        track={track}
                        index={index}
                        moveSong={(dragIndex, hoverIndex) => moveSong(dragIndex, hoverIndex, 'jasurs')}
                        playSelectedVideo={(index) => playSelectedVideo(customSongs.length + index)}
                        deleteSong={deleteJasursSong}
                        currentVideoIndex={currentVideoIndex - customSongs.length}
                        viewStyle={jasursViewStyle}
                    />
                ))}
            </PlaylistSection>
        </div>
    );
};

export default Playlist;