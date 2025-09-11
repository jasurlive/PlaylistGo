// add/tools/player/hooks/usePlayerControls.ts
import { useCallback } from "react";
import { Video } from "../types/interface";

export const usePlayerControls = (
  videoTracks: Video[],
  currentVideo: Video,
  setCurrentVideo: React.Dispatch<React.SetStateAction<Video>>,
  isShuffle: boolean,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  playerRef: React.RefObject<any>
) => {
  // ✅ Play or Pause toggle
  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, [setIsPlaying]);

  // ✅ Play next video
  const playNext = useCallback(() => {
    let nextVideo;
    if (isShuffle) {
      nextVideo = videoTracks[Math.floor(Math.random() * videoTracks.length)];
    } else {
      const currentIndex = videoTracks.findIndex(
        (video) => video.id === currentVideo.id
      );
      nextVideo = videoTracks[(currentIndex + 1) % videoTracks.length];
    }
    setCurrentVideo(nextVideo);
    setIsPlaying(true);
    playerRef.current?.internalPlayer.playVideo();
  }, [
    videoTracks,
    currentVideo,
    isShuffle,
    setCurrentVideo,
    setIsPlaying,
    playerRef,
  ]);

  // ✅ Play previous video
  const playPrevious = useCallback(() => {
    const currentIndex = videoTracks.findIndex(
      (video) => video.id === currentVideo.id
    );
    const prevIndex =
      (currentIndex - 1 + videoTracks.length) % videoTracks.length;
    setCurrentVideo(videoTracks[prevIndex]);
    setIsPlaying(true);
    playerRef.current?.internalPlayer.playVideo();
  }, [videoTracks, currentVideo, setCurrentVideo, setIsPlaying, playerRef]);

  // ✅ Play selected video
  const playSelected = useCallback(
    (id: string) => {
      const selectedVideo = videoTracks.find((video) => video.id === id);
      if (selectedVideo) {
        setCurrentVideo(selectedVideo);
        setIsPlaying(true);
        playerRef.current?.internalPlayer.playVideo();
      }
    },
    [videoTracks, setCurrentVideo, setIsPlaying, playerRef]
  );

  return {
    togglePlayPause,
    playNext,
    playPrevious,
    playSelected,
  };
};
