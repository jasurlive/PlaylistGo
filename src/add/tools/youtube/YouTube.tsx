import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { YTPlayerProps } from "../types/interface";

export const extractVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v");
    }
  } catch (e) {
    return null;
  }
  return null;
};

const YTPlayer: React.FC<YTPlayerProps> = ({
  currentVideoId,
  videoTracks,
  onVideoEnd,
  playerRef,
  autoplay,
  isPlaying,
  setIsPlaying,
  isMuted,
  setPlayedSeconds, // Add setPlayedSeconds prop
  setDuration, // Add setDuration prop
  onSeek, // Add onSeek prop
}) => {
  const video = videoTracks.find((video) => video.id === currentVideoId);
  const videoId = video ? extractVideoId(video.url) : "";
  const url = videoId ? `https://www.youtube.com/watch?v=${videoId}` : "";

  const handleProgress = (state: { playedSeconds: number }) => {
    setPlayedSeconds(state.playedSeconds); // Update the current progress
  };

  const handleDuration = (duration: number) => {
    setDuration(duration); // Set the total duration of the video
  };

  // Automatically sync the isPlaying state with ReactPlayer
  useEffect(() => {
    if (!isPlaying && playerRef?.current) {
      // ReactPlayer will handle pausing itself based on the `playing` prop
    }
  }, [isPlaying]);

  useEffect(() => {
    if (playerRef?.current && onSeek !== undefined) {
      playerRef.current.seekTo = (time: number) => {
        const internalPlayer = playerRef.current.getInternalPlayer();
        if (internalPlayer && typeof internalPlayer.seekTo === "function") {
          internalPlayer.seekTo(time, "seconds"); // Call seekTo only if it exists
        }
      };
    }
  }, [playerRef, onSeek]);
  return (
    <div>
      <ReactPlayer
        key={videoId}
        url={url}
        playing={isPlaying} // Controlled via the isPlaying state
        controls
        muted={isMuted} // Controlled via the isMuted state passed as prop
        width="100%"
        height="100%"
        config={{
          youtube: {
            playerVars: {
              autoplay: autoplay ? 1 : 0,
              controls: 0,
              modestbranding: 1,
              rel: 0,
            },
          },
        }}
        onPlay={() => setIsPlaying(true)} // When the video starts, mark it as playing
        onPause={() => setIsPlaying(false)} // When the video is paused, mark it as not playing
        onEnded={onVideoEnd}
        onProgress={handleProgress} // Track current progress
        onDuration={handleDuration} // Track total duration
        ref={(player) => {
          if (player && playerRef) {
            playerRef.current = player; // Assign the ReactPlayer instance to the ref
          }
        }}
      />
    </div>
  );
};

export default YTPlayer;
