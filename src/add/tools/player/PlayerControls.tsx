import React from 'react';
import { GrPause, GrPlayFill } from "react-icons/gr";
import { LuRepeat1, LuShuffle } from "react-icons/lu";
import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";
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
            <button className={`shuffle-button ${isShuffle ? 'active' : ''}`}
                onClick={() => setIsShuffle(!isShuffle)}
            >
                <LuShuffle />
            </button>
            <button onClick={playPreviousVideo}>
                <RxTrackPrevious />
            </button>
            <button onClick={onPlayPauseToggle}>
                {isPlaying ? (
                    <GrPause />
                ) : (
                    <GrPlayFill />
                )}
            </button>
            <button className="next-button" onClick={playNextVideo}>
                <RxTrackNext />
            </button>

            <button className={`repeat-button ${isRepeatOne ? 'active' : ''}`}
                onClick={() => setIsRepeatOne(!isRepeatOne)}
            >
                <LuRepeat1 />
            </button>
        </div>
    );
};

export default PlayerControls;
