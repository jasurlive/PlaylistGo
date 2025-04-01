import { useEffect, useState } from "react";
import { Video } from "../types/video";

export const useCustomSongs = () => {
  const [customSongs, setCustomSongs] = useState<Video[]>([]);

  useEffect(() => {
    const savedCustomSongs = localStorage.getItem("customSongs");
    if (savedCustomSongs) {
      setCustomSongs(JSON.parse(savedCustomSongs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("customSongs", JSON.stringify(customSongs));
  }, [customSongs]);

  return { customSongs, setCustomSongs };
};
