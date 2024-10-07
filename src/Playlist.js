// src/components/Playlist.js
import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import './MusicPlayer.css'; // Import the custom CSS

const Playlist = ({ customSongs, jasursList, currentVideoIndex, playSelectedVideo, deleteSong, editSong, handleDragStart, handleDragOver, handleDrop, dropIndex }) => {
    return (
        <div>
            <div className="playlists-container">
                <div className="playlist-section">
                    <h3>Your Playlist:</h3>
                    <ul>
                        {customSongs.map((track, index) => (
                            <li
                                key={index}
                                className={`song-item ${currentVideoIndex === index ? 'active' : ''}`} // Add active class
                                onDragStart={(e) => handleDragStart(e, track)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDrop={(e) => handleDrop(e, index)}
                                onClick={() => playSelectedVideo(index)}
                                draggable
                            >
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
                                {dropIndex === index && <div className="drop-line">Drop Here</div>}
                            </li>
                        ))}

                        {/* Drop Line */}
                        {dropIndex === customSongs.length && (
                            <li className="drop-line-container">
                                <div className="drop-line">Drop Here</div>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="playlist-section">
                    <h3>Jasur's Playlist:</h3>
                    <ul>
                        {jasursList.map((track, index) => (
                            <li
                                key={index}
                                className={`song-item ${currentVideoIndex === customSongs.length + index ? 'active' : ''}`} // Add active class
                                onDragStart={(e) => handleDragStart(e, track)}
                                onDragOver={(e) => handleDragOver(e, customSongs.length + index)}
                                onDrop={(e) => handleDrop(e, customSongs.length + index)}
                                onClick={() => playSelectedVideo(customSongs.length + index)}
                                draggable
                            >
                                {track.title}
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
                                {dropIndex === index && <div className="drop-line">Drop Here</div>}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Playlist;
