import { generateUniqueId } from "./ID";
import { Video } from "../../types/interface";

export const fetchPlaylist = async (
  setadminList: React.Dispatch<React.SetStateAction<Video[]>>,
  setCurrentVideo: React.Dispatch<React.SetStateAction<Video>>,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  playerRef: React.RefObject<any>
) => {
  try {
    const response = await fetch("python/songs.csv");
    const text = await response.text();
    const [header, ...rows] = text.trim().split(/\r?\n/);
    const headers = header.split(",");

    const processedData = rows.map((row) => {
      const values = row.split(",");
      const data = Object.fromEntries(
        headers.map((key, i) => [key.trim(), values[i]?.trim() || ""])
      );

      return {
        id: generateUniqueId(),
        title: data.title || "Untitled",
        url: data.url || "",
        thumbnail: "",
      };
    });

    setadminList(processedData);

    if (processedData.length > 0) {
      setCurrentVideo(processedData[0]);
      setIsPlaying(false);
      playerRef.current?.internalPlayer?.playVideo();
    }
  } catch (error) {
    console.error("Error fetching playlist CSV file:", error);
  }
};