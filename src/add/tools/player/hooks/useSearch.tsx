import { useState } from "react";
import { generateUniqueId } from "../../playlist/fetch/ID";
import { Song } from "../../types/interface";

const useSearch = (
  setcustomList: React.Dispatch<React.SetStateAction<Song[]>>,
  addedSongs: Set<string>
) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);

  const searchYouTube = async (): Promise<void> => {
    if (!searchQuery) return;

    const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
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

  const addSongFromSearch = (song: Song): void => {
    setcustomList((prevSongs) => [
      { ...song, id: generateUniqueId() },
      ...prevSongs,
    ]);
    addedSongs.add(song.url);
  };

  const clearSearch = (): void => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchYouTube,
    addSongFromSearch,
    clearSearch,
  };
};

export default useSearch;
