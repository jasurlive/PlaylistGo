import React from "react";
import Shortcuts from "./Shortcuts";
import YouTubeContainer from "../youtube/YouTubeContainer";
import { PlayerContentProps } from "../types/interface";
import { usePlayerControls } from "./hooks/videoControls";
import { useSettingsControl } from "./hooks/settingsControl";

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

  // use settings hook for shuffle/repeat states
  const {
    shuffle,
    repeatOne,
    toggleShuffle,
    toggleRepeatOne,
    setShuffle,
    setRepeatOne,
  } = useSettingsControl({ setIsShuffle, setIsRepeatOne });

  // use player controls hook
  const { playNext, playPrevious } = usePlayerControls(
    videoTracks,
    currentVideo,
    setCurrentVideo,
    shuffle,
    setIsPlaying,
    playerRef
  );

  return (
    <>
      <Shortcuts
        onSearchFocus={() =>
          (
            document.querySelector('input[type="text"]') as HTMLInputElement
          )?.focus()
        }
        onPlayPauseToggle={handlePlayPauseToggle}
        onPlayPrevious={playPrevious}
        onPlayNext={playNext}
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
