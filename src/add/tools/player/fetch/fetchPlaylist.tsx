import * as XLSX from "xlsx";
import { generateUniqueId } from "./ID";
import { Video } from "../../types/interface";

export const fetchPlaylist = async (
  setadminsList: React.Dispatch<React.SetStateAction<Video[]>>,
  setCurrentVideo: React.Dispatch<React.SetStateAction<Video>>,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  playerRef: React.RefObject<any>
) => {
  try {
    const response = await fetch("python/songs.xlsx");
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheet = workbook.Sheets["Active"];
    const data = XLSX.utils.sheet_to_json(sheet);

    const processedData = data.slice(0).map((row: any) => ({
      id: generateUniqueId(),
      title: row["Title"] || "Untitled",
      url: row["YouTube Link"] || "",
      thumbnail: "",
    }));

    setadminsList(processedData);

    if (processedData.length > 0) {
      setCurrentVideo(processedData[0]);
      setIsPlaying(false);
      const player = playerRef.current?.internalPlayer;
      if (player) {
        player.playVideo();
      }
    }
  } catch (error) {
    console.error("Error fetching or processing playlist Excel file:", error);
  }
};
