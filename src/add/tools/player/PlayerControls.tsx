import React from 'react';
import { FaPlayCircle, FaPauseCircle, FaForward, FaBackward, FaRandom, FaRedoAlt } from 'react-icons/fa';

const PlayerControls = ({ isPlaying, onPlayPauseToggle, playNextVideo, playPreviousVideo, isShuffle, setIsShuffle, isRepeatOne, setIsRepeatOne }) => {
    return (
        <div className="controls">
            <FaBackward onClick={playPreviousVideo} style={{ cursor: 'pointer' }} />
            {isPlaying ? (
                <FaPauseCircle onClick={onPlayPauseToggle} style={{ cursor: 'pointer' }} />
            ) : (
                <FaPlayCircle onClick={onPlayPauseToggle} style={{ cursor: 'pointer' }} />
            )}
            <FaForward onClick={playNextVideo} style={{ cursor: 'pointer' }} />
            <div className={`shuffle-button ${isShuffle ? 'active' : ''}`}
                onClick={() => setIsShuffle(!isShuffle)}
                style={{ cursor: 'pointer' }}
            >
                <FaRandom />
            </div>
            <div className={`repeat-button ${isRepeatOne ? 'active' : ''}`}
                onClick={() => setIsRepeatOne(!isRepeatOne)}
                style={{ cursor: 'pointer' }}
            >
                <FaRedoAlt />
            </div>
        </div>
    );
};

export default PlayerControls;
