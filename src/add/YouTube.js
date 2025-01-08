import React, { useRef, useEffect } from 'react';
import YouTube from 'react-youtube';

// YouTube player options with 16:9 ratio
const opts = {
    playerVars: {
        autoplay: 1,              // Disable autoplay by default
        controls: 1,              // Show player controls
        modestbranding: 1,        // Minimize YouTube branding
        rel: 0,
    },
};

// Extract YouTube video ID
export const extractVideoId = (url) => {
    // eslint-disable-next-line
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
};

const YTPlayer = ({ currentVideoIndex, videoTracks, onVideoEnd, playerRef, autoplay, onToggleFullScreen }) => {
    const videoId = videoTracks[currentVideoIndex]?.url ? extractVideoId(videoTracks[currentVideoIndex].url) : '';

    const playerContainerRef = useRef(null);

    // Function to toggle fullscreen
    const toggleFullscreen = () => {
        if (playerContainerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                playerContainerRef.current.requestFullscreen();
            }
        }
    };

    // Call fullscreen toggle from parent component
    useEffect(() => {
        if (onToggleFullScreen) {
            onToggleFullScreen(toggleFullscreen);
        }
    }, [onToggleFullScreen]);

    const playerOpts = {
        ...opts,
        playerVars: {
            ...opts.playerVars,
            autoplay: autoplay ? 1 : 0, // Set autoplay based on the prop
        },
    };

    return (
        <div ref={playerContainerRef}>
            <YouTube
                videoId={videoId}
                opts={playerOpts}
                onEnd={onVideoEnd}
                ref={playerRef}
            />
        </div>
    );
};

export default YTPlayer;