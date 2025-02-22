// usePlaylist.js
import { useState, useEffect } from 'react';
import { generateUniqueId } from './ID';
import * as XLSX from 'xlsx';

interface Video {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
}

const usePlaylist = () => {
    const [customSongs, setCustomSongs] = useState<Video[]>([]);
    const [jasursList, setJasursList] = useState<Video[]>([]);
    const [currentVideo, setCurrentVideo] = useState<Video>({ id: '', title: '', url: '', thumbnail: '' });
    const [isPlaying, setIsPlaying] = useState(true);

    const fetchPlaylist = async () => {
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/songs.xlsx`);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheet = workbook.Sheets["Active"];
            const data = XLSX.utils.sheet_to_json(sheet);

            const processedData = data.slice(0).map((row: any) => ({
                id: generateUniqueId(),
                title: row["Title"] || 'Untitled',
                url: row["YouTube Link"] || '',
                thumbnail: ''
            }));

            setJasursList(processedData);

            if (processedData.length > 0) {
                setCurrentVideo(processedData[0]);
                setIsPlaying(true);
            }
        } catch (error) {
            console.error('Error fetching or processing playlist Excel file:', error);
        }
    };

    useEffect(() => {
        fetchPlaylist();
    }, []);

    useEffect(() => {
        const savedCustomSongs = localStorage.getItem('customSongs');
        if (savedCustomSongs) {
            setCustomSongs(JSON.parse(savedCustomSongs));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('customSongs', JSON.stringify(customSongs));
    }, [customSongs]);

    return { customSongs, setCustomSongs, jasursList, setJasursList, currentVideo, setCurrentVideo, isPlaying, setIsPlaying };
};

export default usePlaylist;
