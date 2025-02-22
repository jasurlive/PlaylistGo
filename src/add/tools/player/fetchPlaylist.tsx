import * as XLSX from 'xlsx';
import { generateUniqueId } from './ID';

interface Video {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
}

export const fetchPlaylist = async (setJasursList: React.Dispatch<React.SetStateAction<Video[]>>, setCurrentVideo: React.Dispatch<React.SetStateAction<Video>>, setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>, playerRef: React.RefObject<any>) => {
    try {
        const response = await fetch('python/songs.xlsx');
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
            const player = playerRef.current?.internalPlayer;
            if (player) {
                player.playVideo();
            }
        }
    } catch (error) {
        console.error('Error fetching or processing playlist Excel file:', error);
    }
};
