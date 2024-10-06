// src/components/YT.js
import React from 'react'; // Remove useRef from the import list
import YouTube from 'react-youtube';

// Default playlist (Jasur's list)
export const jasursList = [
    { title: 'Heart is on fire', url: 'https://youtu.be/kBqqlW6-99M?si=kXaaJTqhA4PaY6Gd' },
    { title: 'Irakliy - Ya s toboy(cover)', url: 'https://youtu.be/3WmdZOF5bKk?si=LcXY8Gohxxx4cZSA' },
    { title: 'Vetrom stat` (cover)', url: 'https://youtu.be/kkzEs0gdvZI?si=Z456wgKuJd0aE_PA' },
    { title: 'Reamonn - Supergirl', url: 'https://youtu.be/ucI3IpuM-NQ?si=mH62PwU2B4_p1GFg' },
    { title: 'Another Love', url: 'https://youtu.be/MwpMEbgC7DA?si=8HUQvzasZEq-4AZL' },
    { title: 'Ava Max - So Am I', url: 'https://youtu.be/SxGLPVvNjvY?si=tVcL1slKTd_OOY3N' },
    { title: 'Arcade', url: 'https://youtu.be/Qau6mObfSGM?si=RsrcZ0VUCOHaEwE4' },
    { title: 'Femme like you', url: 'https://youtu.be/8qfM7offtiA?si=L-0D4vQeApvABOh_' },

    // { title: 'NAME', url: 'LINK' },
];

// YouTube player options with 16:9 ratio
const opts = {
    height: '180',  // Calculated height for 16:9 ratio
    width: '320',   // Fixed width of 320px
    playerVars: {
        autoplay: 1,              // Automatically start playing the video
        controls: 0,              // Hide all player controls
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

// YTPlayer component
const YTPlayer = ({ currentVideoIndex, videoTracks, onVideoEnd, playerRef }) => {
    return (
        <YouTube
            videoId={extractVideoId(videoTracks[currentVideoIndex].url)}
            opts={opts}
            onEnd={onVideoEnd}
            ref={playerRef}
        />
    );
};

export default YTPlayer;
