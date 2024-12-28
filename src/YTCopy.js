import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import * as XLSX from 'xlsx';

// Initialize jasursList as an empty array
export let jasursList = [];

// YouTube player options
const opts = {
    playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
    },
};

// Extract YouTube video ID
export const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
};

// YouTube Component
const YTPlayer = ({ currentVideoIndex, onVideoEnd, playerRef, autoplay }) => {
    const [playlist, setPlaylist] = useState([]);

    // Fetch and process the Excel file
    const fetchPlaylist = async () => {
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/songs.xlsx`);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheet = workbook.Sheets["Active"]; // Use "Active" as the sheet name
            const data = XLSX.utils.sheet_to_json(sheet);

            const processedData = data.slice(1).map((row) => ({
                title: row["Title"] || 'Untitled', // Access "Title" column
                url: row["Youtube Link"] || '',   // Access "Youtube Link" column
            }));

            setPlaylist(processedData);
            jasursList.splice(0, jasursList.length, ...processedData); // Update global variable
        } catch (error) {
            console.error('Error fetching or processing playlist Excel file:', error);
        }
    };

    useEffect(() => {
        fetchPlaylist(); // Fetch playlist data when the component mounts
    }, []);

    const videoId = playlist[currentVideoIndex]?.url
        ? extractVideoId(playlist[currentVideoIndex].url)
        : '';

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <YouTube
                videoId={videoId}
                opts={{
                    ...opts,
                    playerVars: {
                        ...opts.playerVars,
                        autoplay: autoplay ? 1 : 0,
                    },
                }}
                onEnd={onVideoEnd}
                ref={playerRef}
            />
        </div>
    );
};

export default YTPlayer;
