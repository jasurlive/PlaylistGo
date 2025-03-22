import React from "react";
import Shortcuts from "./Shortcuts";
import YouTubeContainer from "../youtube/YouTubeContainer";
import SearchBar from "./SearchBar";
import Playlist from "../../../Playlist";
import { Video } from "../playlist/types";
import {
  playNextVideo,
  playPreviousVideo,
  playSelectedVideo,
} from "./videoControls";

interface PlayerContentProps {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  currentVideo: Video;
  setCurrentVideo: React.Dispatch<React.SetStateAction<Video>>;
  videoTracks: Video[];
  isShuffle: boolean;
  setIsShuffle: React.Dispatch<React.SetStateAction<boolean>>;
  isRepeatOne: boolean;
  setIsRepeatOne: React.Dispatch<React.SetStateAction<boolean>>;
  playerRef: React.RefObject<any>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchResults: Video[];
  searchYouTube: () => void;
  clearSearch: () => void;
  addedSongs: Set<string>;
  addSongFromSearch: (song: Video) => void;
  customSongs: Video[];
  jasursList: Video[];
  setCustomSongs: React.Dispatch<React.SetStateAction<Video[]>>;
  setJasursList: React.Dispatch<React.SetStateAction<Video[]>>;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
  isPlaying,
  setIsPlaying,
  currentVideo,
  setCurrentVideo,
  videoTracks,
  isShuffle,
  setIsShuffle,
  isRepeatOne,
  setIsRepeatOne,
  playerRef,
  searchQuery,
  setSearchQuery,
  searchResults,
  searchYouTube,
  clearSearch,
  addedSongs,
  addSongFromSearch,
  customSongs,
  jasursList,
  setCustomSongs,
  setJasursList,
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

  return (
    <>
      <Shortcuts
        onSearchFocus={() =>
          (
            document.querySelector('input[type="text"]') as HTMLInputElement
          )?.focus()
        }
        onPlayPauseToggle={handlePlayPauseToggle} // Pass the function here
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
            isShuffle,
            playerRef
          )
        }
        onToggleShuffle={() => setIsShuffle(!isShuffle)}
        onToggleRepeatOne={() => setIsRepeatOne(!isRepeatOne)}
      />
      <YouTubeContainer
        currentVideo={currentVideo}
        videoTracks={videoTracks}
        isPlaying={isPlaying}
        isShuffle={isShuffle}
        isRepeatOne={isRepeatOne}
        setIsPlaying={setIsPlaying}
        setIsShuffle={setIsShuffle}
        setIsRepeatOne={setIsRepeatOne}
        setCurrentVideo={setCurrentVideo}
        playerRef={playerRef}
      />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchYouTube={searchYouTube}
        searchResults={searchResults}
        addedSongs={addedSongs}
        addSongFromSearch={addSongFromSearch}
        clearSearch={clearSearch}
      />
      <Playlist
        customSongs={customSongs}
        jasursList={jasursList}
        currentVideoId={currentVideo.id}
        playSelectedVideo={(id: string) =>
          playSelectedVideo(id, videoTracks, setCurrentVideo, setIsPlaying)
        }
        setCustomSongs={setCustomSongs}
        setJasursList={setJasursList}
      />
    </>
  );
};

export default PlayerContent;
