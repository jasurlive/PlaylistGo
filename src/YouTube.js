// src/components/YouTube.js
import React, { useRef } from 'react';
import YouTube from 'react-youtube';

// Default playlist (Jasur's list)
const jasursList = [
    { title: 'Heart is on fire', url: 'https://youtu.be/kBqqlW6-99M?si=kXaaJTqhA4PaY6Gd' },
    { title: 'Irakliy - Ya s toboy(cover)', url: 'https://youtu.be/3WmdZOF5bKk?si=LcXY8Gohxxx4cZSA' },
    { title: 'Vetrom stat` (cover)', url: 'https://youtu.be/kkzEs0gdvZI?si=Z456wgKuJd0aE_PA' },
    { title: 'Reamonn - Supergirl', url: 'https://youtu.be/ucI3IpuM-NQ?si=mH62PwU2B4_p1GFg' },
    { title: 'Another Love', url: 'https://youtu.be/MwpMEbgC7DA?si=8HUQvzasZEq-4AZL' },
    { title: 'Ava Max - So Am I', url: 'https://youtu.be/SxGLPVvNjvY?si=tVcL1slKTd_OOY3N' },
    { title: 'Arcade', url: 'https://youtu.be/Qau6mObfSGM?si=RsrcZ0VUCOHaEwE4' },
    { title: 'Chumoli', url: 'https://youtu.be/VNBxmb9VLRM?si=Fk7SNDPjp4MeqZuy' },
    { title: 'Heart is on fire', url: 'https://youtu.be/kBqqlW6-99M?si=kXaaJTqhA4PaY6Gd' },
];

const YouTubePlayer = ({
    videoId,
    onVideoEnd,
    isPlaying,
    setIsPlaying,
    currentVideoIndex,
    playNextVideo,
    playPreviousVideo,
}) => {
    const playerRef = useRef(null);

    const opts = {
        height: '200',
        width: '300',
        playerVars: {
            autoplay: 1,
        },
    };

    const onPlayPauseToggle = () => {
        const player = playerRef.current.internalPlayer;
        if (isPlaying) {
            player.pauseVideo();
            setIsPlaying(false);
        } else {
            player.playVideo();
            setIsPlaying(true);
        }
    };

    const onVideoEndHandler = () => {
        onVideoEnd();
    };

    return (
        <div>
            <YouTube
                videoId={videoId}
                opts={opts}
                onEnd={onVideoEndHandler}
                ref={playerRef}
            />
            <div className="controls">
                <button onClick={playPreviousVideo}>Previous</button>
                <button onClick={onPlayPauseToggle}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={playNextVideo}>Next</button>
            </div>
        </div>
    );
};

// Export YouTubePlayer as default
export default YouTubePlayer;

// Export jasursList
export { jasursList };
