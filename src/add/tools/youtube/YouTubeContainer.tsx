import React from "react";
import YTPlayer from "./YouTube";
import PlayerControls from "../player/PlayerControls";
import { playNextVideo, playPreviousVideo } from "../player/videoControls";
import { Video } from "../playlist/types";

interface YouTubeContainerProps {
  currentVideo: Video;
  videoTracks: Video[];
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeatOne: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShuffle: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRepeatOne: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentVideo: React.Dispatch<React.SetStateAction<Video>>;
  playerRef: React.RefObject<any>;
}

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
  const handlePlayPauseToggle = () => {
    if (playerRef.current) {
      const playerState = playerRef.current.getPlayerState();
      if (playerState === 1) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  };

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
      <PlayerControls
        isPlaying={isPlaying}
        onPlayPauseToggle={handlePlayPauseToggle}
        playNextVideo={() =>
          playNextVideo(
            videoTracks,
            currentVideo,
            setCurrentVideo,
            setIsPlaying,
            isShuffle,
            playerRef
          )
        }
        playPreviousVideo={() =>
          playPreviousVideo(
            videoTracks,
            currentVideo,
            setCurrentVideo,
            setIsPlaying,
            playerRef
          )
        }
        isShuffle={isShuffle}
        setIsShuffle={setIsShuffle}
        isRepeatOne={isRepeatOne}
        setIsRepeatOne={setIsRepeatOne}
      />
    </div>
  );
};

export default YouTubeContainer;
