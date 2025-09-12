import { useState } from "react";
import { Video } from "../../types/interface";
import { generateUniqueId } from "../../playlist/fetch/ID";

export const useYouTubeSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [addedSongs, setAddedSongs] = useState(new Set<string>());

  const searchYouTube = async () => {
    if (!searchQuery) return;

    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          searchQuery
        )}&type=video&maxResults=50&key=${API_KEY}`
      );
      const data = await response.json();

      if (Array.isArray(data.items)) {
        const results = data.items.map((item: any) => ({
          id: generateUniqueId(),
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          thumbnail: item.snippet.thumbnails.default.url,
        }));
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchYouTube,
    clearSearch,
    addedSongs,
    setAddedSongs,
  };
};
