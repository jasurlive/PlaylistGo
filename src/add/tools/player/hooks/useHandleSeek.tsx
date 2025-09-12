import { RefObject } from "react";

export const useSeekControl = (
  playerRef: RefObject<any>,
  setPlayedSeconds: React.Dispatch<React.SetStateAction<number>>
) => {
  const handleSeek = (time: number) => {
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(time);
      setPlayedSeconds(time);
    }
  };

  return { handleSeek };
};
