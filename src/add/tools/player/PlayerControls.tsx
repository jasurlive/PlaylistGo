import React from 'react';
import { FaPlayCircle, FaPauseCircle, FaForward, FaBackward, FaRandom, FaRedoAlt } from 'react-icons/fa';

interface PlayerControlsProps {
    isPlaying: boolean;
    onPlayPauseToggle: () => void;
    playNextVideo: () => void;
    playPreviousVideo: () => void;
    isShuffle: boolean;
    setIsShuffle: (shuffle: boolean) => void;
    isRepeatOne: boolean;
    setIsRepeatOne: (repeatOne: boolean) => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
    isPlaying,
    onPlayPauseToggle,
    playNextVideo,
    playPreviousVideo,
    isShuffle,
    setIsShuffle,
    isRepeatOne,
    setIsRepeatOne
}) => {
    return (
        <div className="controls">
            <FaBackward onClick={playPreviousVideo} />
            {isPlaying ? (
                <FaPauseCircle onClick={onPlayPauseToggle} />
            ) : (
                <FaPlayCircle onClick={onPlayPauseToggle} />
            )}
            <FaForward onClick={playNextVideo} />
            <div className={`shuffle-button ${isShuffle ? 'active' : ''}`}
                onClick={() => setIsShuffle(!isShuffle)}
            >
                <FaRandom />
            </div>
            <div className={`repeat-button ${isRepeatOne ? 'active' : ''}`}
                onClick={() => setIsRepeatOne(!isRepeatOne)}
            >
                <FaRedoAlt />
            </div>
        </div>
    );
};

export default PlayerControls;
