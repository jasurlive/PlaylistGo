import { useEffect, useState } from 'react';

interface Video {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
}

export const useCustomSongs = () => {
    const [customSongs, setCustomSongs] = useState<Video[]>([]);

    useEffect(() => {
        const savedCustomSongs = localStorage.getItem('customSongs');
        if (savedCustomSongs) {
            setCustomSongs(JSON.parse(savedCustomSongs));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('customSongs', JSON.stringify(customSongs));
    }, [customSongs]);

    return { customSongs, setCustomSongs };
};
