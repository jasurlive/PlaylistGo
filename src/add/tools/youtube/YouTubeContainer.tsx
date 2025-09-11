import React from "react";
import YTPlayer from "./YouTube";
import { usePlayerControls } from "../player/videoControls"; // now our hook lives here
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
  setPlayedSeconds,
  setDuration,
}) => {
  // Use the unified controls hook
  const { playNext } = usePlayerControls(
    videoTracks,
    currentVideo,
    setCurrentVideo,
    isShuffle,
    setIsPlaying,
    playerRef
  );

  //Clean onVideoEnd using hook
  const onVideoEndHandler = () => {
    if (isRepeatOne) {
      if (playerRef.current && typeof playerRef.current.seekTo === "function") {
        playerRef.current.seekTo(0); // restart the video
        setIsPlaying(true);
      }
    } else {
      playNext(); // use unified playNext
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
          setPlayedSeconds={setPlayedSeconds}
          setDuration={setDuration}
          onSeek={(time) => playerRef.current?.seekTo(time)}
        />
      </div>
    </div>
  );
};

export default YouTubeContainer;
