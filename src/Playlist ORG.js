import React, { useState, useEffect } from 'react';
import { FaTrash, FaChevronDown, FaChevronUp, FaMusic, FaThLarge, FaBars } from 'react-icons/fa';

import './add/css/playlist.css';

const SongItem = ({
    track,
    playSelectedVideo,
    deleteSong,
    currentVideoId,
    viewStyle,
}) => {
    return (
        <li
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
    currentVideoId,
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

    const moveSong = (dragId, hoverId, listType) => {
        if (listType === 'custom') {
            setCustomSongs((prevSongs) => {
                const updatedSongs = [...prevSongs];
                const dragIndex = updatedSongs.findIndex(song => song.id === dragId);
                const hoverIndex = updatedSongs.findIndex(song => song.id === hoverId);
                const [movedSong] = updatedSongs.splice(dragIndex, 1);
                updatedSongs.splice(hoverIndex, 0, movedSong);
                return updatedSongs;
            });
        } else {
            setJasursList((prevSongs) => {
                const updatedSongs = [...prevSongs];
                const dragIndex = updatedSongs.findIndex(song => song.id === dragId);
                const hoverIndex = updatedSongs.findIndex(song => song.id === hoverId);
                const [movedSong] = updatedSongs.splice(dragIndex, 1);
                updatedSongs.splice(hoverIndex, 0, movedSong);
                return updatedSongs;
            });
        }
    };

    const deleteCustomSong = (id) => {
        setCustomSongs((prevSongs) => {
            const updatedSongs = prevSongs.filter(song => song.id !== id);
            return updatedSongs;
        });
    };

    const deleteJasursSong = (id) => {
        setJasursList((prevSongs) => {
            const updatedSongs = prevSongs.filter(song => song.id !== id);
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
                {customSongs.map((track) => (
                    <SongItem
                        key={track.id}
                        track={track}
                        moveSong={(dragId, hoverId) => moveSong(dragId, hoverId, 'custom')}
                        playSelectedVideo={playSelectedVideo}
                        deleteSong={deleteCustomSong}
                        currentVideoId={currentVideoId}
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
                {jasursList.map((track) => (
                    <SongItem
                        key={track.id}
                        track={track}
                        moveSong={(dragId, hoverId) => moveSong(dragId, hoverId, 'jasurs')}
                        playSelectedVideo={playSelectedVideo}
                        deleteSong={deleteJasursSong}
                        currentVideoId={currentVideoId}
                        viewStyle={jasursViewStyle}
                    />
                ))}
            </PlaylistSection>
        </div>
    );
};

export default Playlist;
