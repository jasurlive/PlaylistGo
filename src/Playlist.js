// src/components/Playlist.js
import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import './MusicPlayer.css'; // Import the custom CSS

const Playlist = ({ customSongs, jasursList, currentVideoIndex, playSelectedVideo, deleteSong, editSong }) => {
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
                                onClick={() => playSelectedVideo(index)}
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
                            </li>
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
