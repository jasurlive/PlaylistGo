import React from "react";
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
}) => {
  const onVideoEndHandler = () => {
    if (isRepeatOne) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
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
          autoplay={isPlaying}
        />
      </div>
    </div>
  );
};

export default YouTubeContainer;
