// src/components/YT.js
import React from 'react';
import YouTube from 'react-youtube';

// Default playlist (Jasur's list)
export const jasursList = [

    { title: 'Everything I Need', url: 'https://www.youtube.com/watch?v=9bCp7j3nC30' },
    { title: 'Love the way you lie', url: 'https://youtu.be/h_-JFUci0BM?si=SHiuHs1NdIjpN0WP' },
    { title: 'Moving Mountains', url: 'https://youtu.be/S_0r3hYg78o?si=Be6GShy7mgRcl9Ha' },
    { title: 'Numb cover)', url: 'https://youtu.be/gHp-OjLOG5A?si=0abUDswbKz6rhQeX' },
    { title: 'Until I found you', url: 'https://youtu.be/oIKuyj2GQtY' },
    { title: 'Heart is on fire', url: 'https://youtu.be/kBqqlW6-99M?si=kXaaJTqhA4PaY6Gd' },
    { title: 'Holes', url: 'https://youtu.be/DeFWClW7skQ?si=hkIGl-CTTw-FbnLz' },
    { title: 'Survivors', url: 'https://www.youtube.com/watch?v=vN0gaXS8dQE' },
    { title: 'Irakliy - Ya s toboy(cover)', url: 'https://youtu.be/3WmdZOF5bKk?si=LcXY8Gohxxx4cZSA' },
    { title: 'Vetrom stat` (cover)', url: 'https://youtu.be/kkzEs0gdvZI?si=Z456wgKuJd0aE_PA' },
    { title: 'Reamonn - Supergirl', url: 'https://youtu.be/ctmS5XX67Ek?si=NGZGPw0bcpfZciyi' },
    { title: 'Another Love', url: 'https://youtu.be/Jkj36B1YuDU?si=Yku5tRPe7avRNr2R' },
    { title: 'All the little lights', url: 'https://youtu.be/OkxVxox--Io?si=AE4wj_c_uqTWGrbB' },
    { title: 'Arcade', url: 'https://youtu.be/Qau6mObfSGM?si=RsrcZ0VUCOHaEwE4' },
    { title: 'Burito - Po volnam', url: 'https://youtu.be/jqyJ4xW2gb0?si=VgrA4JKMWkeWDIA5' },
    { title: 'To Be Free', url: 'https://youtu.be/hNd5pILkpSw?si=qiwZxiuS0yeiuOPs' },
    { title: 'Castle of Glass', url: 'https://www.youtube.com/watch?v=PPkJeWPP2nM' },
    { title: 'Ava Max - Alone', url: 'https://youtu.be/omvW1cI-3xg?si=zHiFadZaUUpddcgu' },
    { title: 'Let Her Go (ft Ed Sheeran)', url: 'https://youtu.be/HTcL9WkB_wg?si=ILXw9EaPM4GJyx29' },
    { title: 'In the end (rmx)', url: 'https://youtu.be/WNeLUngb-Xg?si=V95nGOt0sMvhQG7c' },
    { title: 'No Time To Die', url: 'https://youtu.be/GB_S2qFh5lU?si=XDH6CdXhqJq-g321' },
    { title: 'Tired Of Being Sorry', url: 'https://youtu.be/gzFmctgW0s8?si=JfvG_0Sj-IdPWoBY' },
    { title: 'Wonderful Life', url: 'https://youtu.be/qzn_6bXdgeE?si=BgnimyD5Frnn_-o-' },
    { title: 'Shape of My Heart', url: 'https://youtu.be/pm3rDbXbZRI?si=7TxDuViBxhHGeZoU' },
    { title: 'Today is a Good Day', url: 'https://youtu.be/qfv0j1FyjWw?si=djHeR7tPQQALeLoq' },




    /* { title: 'NAME', url: 'LINK' }, */

];

// YouTube player options with 16:9 ratio
const opts = {
    playerVars: {
        autoplay: 0,              // Disable autoplay by default
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

// YTPlayer component
const YTPlayer = ({ currentVideoIndex, videoTracks, onVideoEnd, playerRef, autoplay }) => {
    // Handle out-of-bounds index gracefully
    const videoId = videoTracks[currentVideoIndex]?.url ? extractVideoId(videoTracks[currentVideoIndex].url) : '';

    const playerOpts = {
        ...opts,
        playerVars: {
            ...opts.playerVars,
            autoplay: autoplay ? 1 : 0, // Set autoplay based on the prop
        },
    };

    return (
        <YouTube
            videoId={videoId}
            opts={playerOpts}
            onEnd={onVideoEnd}
            ref={playerRef}
        />
    );
};

export default YTPlayer;
