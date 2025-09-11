import React from "react";
import Shortcuts from "./Shortcuts";
import YouTubeContainer from "../youtube/YouTubeContainer";
import { PlayerContentProps } from "../types/interface";
import { playNextVideo, playPreviousVideo } from "./videoControls";
import { useSettingsControl } from "../player/controls/settingsControl";

const PlayerContent: React.FC<PlayerContentProps> = ({
  isPlaying,
  setIsPlaying,
  currentVideo,
  setCurrentVideo,
  videoTracks,
  setIsShuffle,
  setIsRepeatOne,
  playerRef,
  setPlayedSeconds,
  setDuration,
}) => {
  const handlePlayPauseToggle = () => {
    setIsPlaying((prev) => !prev);
  };

  // ✅ Use reusable hook
  const {
    shuffle,
    repeatOne,
    toggleShuffle,
    toggleRepeatOne,
    setShuffle,
    setRepeatOne,
  } = useSettingsControl({ setIsShuffle, setIsRepeatOne });

  return (
    <>
      <Shortcuts
        onSearchFocus={() =>
          (
            document.querySelector('input[type="text"]') as HTMLInputElement
          )?.focus()
        }
        onPlayPauseToggle={handlePlayPauseToggle}
        onPlayPrevious={() =>
          playPreviousVideo(
            videoTracks,
            currentVideo,
            setCurrentVideo,
            setIsPlaying,
            playerRef
          )
        }
        onPlayNext={() =>
          playNextVideo(
            videoTracks,
            currentVideo,
            setCurrentVideo,
            setIsPlaying,
            shuffle,
            playerRef
          )
        }
        onToggleShuffle={toggleShuffle}
        onToggleRepeatOne={toggleRepeatOne}
      />
      <YouTubeContainer
        currentVideo={currentVideo}
        videoTracks={videoTracks}
        isPlaying={isPlaying}
        isShuffle={shuffle}
        isRepeatOne={repeatOne}
        setIsPlaying={setIsPlaying}
        setIsShuffle={setShuffle}
        setIsRepeatOne={setRepeatOne}
        setCurrentVideo={setCurrentVideo}
        playerRef={playerRef}
        setPlayedSeconds={setPlayedSeconds}
        setDuration={setDuration}
      />
    </>
  );
};

export default PlayerContent;
