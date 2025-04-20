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
  setIsShuffle,
  setIsRepeatOne,
  setCurrentVideo,
  playerRef,
  setPlayedSeconds, // Add setPlayedSeconds prop
  setDuration, // Add setDuration prop
}) => {
  const [isMuted, setIsMuted] = useState(false); // Add state for mute

  const onVideoEndHandler = () => {
    if (isRepeatOne) {
      if (playerRef.current?.seekTo) {
        playerRef.current.seekTo(0);
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

  // Toggle mute state
  const handleMuteToggle = () => {
    setIsMuted((prev) => !prev);
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
          isMuted={isMuted}
          setIsMuted={setIsMuted} // Pass isMuted state to YTPlayer
          handleMuteToggle={handleMuteToggle} // Pass handleMuteToggle to YTPlayer
          setPlayedSeconds={setPlayedSeconds} // Pass setPlayedSeconds to YTPlayer
          setDuration={setDuration} // Pass setDuration to YTPlayer
        />
      </div>
    </div>
  );
};

export default YouTubeContainer;
