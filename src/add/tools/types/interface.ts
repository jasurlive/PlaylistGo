// all interfaces here! come on baby!

import { RefObject } from "react";

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
}

export interface Song {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
}
export interface PlaylistProps {
  customSongs: Video[];
  jasursList: Video[];
  currentVideoId: string;
  playSelectedVideo: (id: string) => void;
  setCustomSongs: React.Dispatch<React.SetStateAction<Video[]>>;
  setJasursList: React.Dispatch<React.SetStateAction<Video[]>>;
}

export interface NavMenuProps {
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
  currentVideo: Video;
  playSelectedVideo: (id: string) => void;
}

export interface UserStatus {
  state: string;
  last_changed: any;
  browser: string;
  os: string;
  device: string;
  ip: string;
  city: string;
  country: string;
}

export interface PlayerContentProps {
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

export interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
  playNextVideo: () => void;
  playPreviousVideo: () => void;
  isShuffle: boolean;
  setIsShuffle: React.Dispatch<React.SetStateAction<boolean>>;
  isRepeatOne: boolean;
  setIsRepeatOne: React.Dispatch<React.SetStateAction<boolean>>;
  playerRef: RefObject<any>;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchYouTube: () => void;
  searchResults: Video[];
  addedSongs: Set<string>;
  addSongFromSearch: (song: Video) => void;
  clearSearch: () => void;
}

export interface ShortcutsProps {
  onSearchFocus: () => void;
  onPlayPauseToggle: () => void;
  onPlayPrevious: () => void;
  onPlayNext: () => void;
  onToggleShuffle: () => void;
  onToggleRepeatOne: () => void;
}

export interface PlaylistSectionProps {
  title: string;
  songs: Video[];
  setSongs: React.Dispatch<React.SetStateAction<Video[]>>;
  currentVideoId: string;
  playSelectedVideo: (id: string) => void;
  deleteSong: (id: string) => void;
}

export interface SongItemProps {
  track: Video;
  playSelectedVideo: (id: string) => void;
  deleteSong: (id: string) => void;
  currentVideoId: string;
}

export interface YTPlayerProps {
  currentVideoId: string;
  videoTracks: { id: string; title: string; url: string }[];
  onVideoEnd: () => void;
  playerRef: React.RefObject<any>;
  autoplay: boolean;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  setIsMuted: (isMuted: boolean) => void;
  isMuted: boolean;
  handleMuteToggle: () => void;
}
export interface YouTubeContainerProps {
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
