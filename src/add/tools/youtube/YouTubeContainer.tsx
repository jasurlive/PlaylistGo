import React, { useState } from "react";
import YTPlayer from "./YouTube";
import { playNextVideo, playPreviousVideo } from "../player/videoControls";
import { YouTubeContainerProps } from "../types/interface";

const YouTubeContainer: React.FC<YouTubeContainerProps> = ({
  currentVideo,
  videoTracks,
  isPlaying,
  isShuffle,
  isRepeatOne,
  setIsPlaying,
  setCurrentVideo,
  playerRef,
  setPlayedSeconds, // Add setPlayedSeconds prop
  setDuration, // Add setDuration prop
}) => {
  const onVideoEndHandler = () => {
    if (isRepeatOne) {
      if (playerRef.current && typeof playerRef.current.seekTo === "function") {
        playerRef.current.seekTo(0); // Call seekTo only if it exists
        setIsPlaying(true);
      }
    } else {
      playNextVideo(
        videoTracks,
        currentVideo,
        setCurrentVideo,
        setIsPlaying,
        isShuffle,
        playerRef
      );
    }
  };

  return (
    <div className="youtube-container">
      <div className="video-wrapper">
        <YTPlayer
          currentVideoId={currentVideo.id}
          videoTracks={videoTracks}
          onVideoEnd={onVideoEndHandler}
          playerRef={playerRef}
          autoplay={true}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          setPlayedSeconds={setPlayedSeconds} // Pass setPlayedSeconds to YTPlayer
          setDuration={setDuration} // Pass setDuration to YTPlayer
          onSeek={(time) => playerRef.current?.seekTo(time)} // Pass onSeek prop
        />
      </div>
    </div>
  );
};

export default YouTubeContainer;
