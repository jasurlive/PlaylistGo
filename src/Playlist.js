// src/components/Playlist.js
import React from 'react';
import { useDrag, useDrop } from 'react-dnd'; // Import hooks for drag-and-drop
import { FaTrash, FaEdit, FaGripVertical } from 'react-icons/fa'; // Import the grip icon for dragging
import './MusicPlayer.css'; // Import the custom CSS

// Define an item type for drag-and-drop
const ITEM_TYPE = 'SONG_ITEM';

const SongItem = ({ track, index, moveSong, playSelectedVideo, deleteSong, editSong, currentVideoIndex }) => {
    // Implement drag
    const [, dragRef] = useDrag({
        type: ITEM_TYPE,
        item: { index },
    });

    // Implement drop
    const [, dropRef] = useDrop({
        accept: ITEM_TYPE,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveSong(draggedItem.index, index);
                draggedItem.index = index; // Update the index of the dragged item
            }
        },
    });

    return (
        <li
            ref={(node) => dragRef(dropRef(node))} // Attach drag-and-drop refs to the list item
            className={`song-item ${currentVideoIndex === index ? 'active' : ''}`} // Add active class
            onClick={() => playSelectedVideo(index)}
        >
            <FaGripVertical className="drag-icon" /> {/* Drag icon */}
            {track.title}{' '}
            <div className="icon-container"> {/* Wrapper for icons */}
                <FaEdit
                    onClick={(e) => { e.stopPropagation(); editSong(index); }}
                    className="icon edit-icon"
                />
                <FaTrash
                    onClick={(e) => { e.stopPropagation(); deleteSong(index); }}
                    className="icon delete-icon"
                />
            </div>
        </li>
    );
};

const Playlist = ({ customSongs, jasursList, currentVideoIndex, playSelectedVideo, deleteSong, editSong, setCustomSongs }) => {
    // Move songs within the custom playlist
    const moveSong = (dragIndex, hoverIndex) => {
        const updatedSongs = [...customSongs];
        const [movedSong] = updatedSongs.splice(dragIndex, 1);
        updatedSongs.splice(hoverIndex, 0, movedSong);
        setCustomSongs(updatedSongs);
    };

    return (
        <div>
            <div className="playlists-container">
                <div className="playlist-section">
                    <h3>Your Playlist:</h3>
                    <ul>
                        {customSongs.map((track, index) => (
                            <SongItem
                                key={index}
                                track={track}
                                index={index}
                                moveSong={moveSong}
                                playSelectedVideo={playSelectedVideo}
                                deleteSong={deleteSong}
                                editSong={editSong}
                                currentVideoIndex={currentVideoIndex}
                            />
                        ))}
                    </ul>
                </div>
                <div className="playlist-section">
                    <h3>Random Playlist:</h3>
                    <ul>
                        {jasursList.map((track, index) => (
                            <li
                                key={index}
                                className={`song-item ${currentVideoIndex === customSongs.length + index ? 'active' : ''}`} // Add active class
                                onClick={() => playSelectedVideo(customSongs.length + index)}
                            >
                                {track.title}
                                <div className="icon-container"> {/* Wrapper for icons */}
                                    {/* Icons can be added if needed */}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Playlist;
