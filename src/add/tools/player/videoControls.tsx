import { Video } from "../types/interface";

export const onVideoEnd = (
  isRepeatOne: boolean,
  playNextVideo: () => void,
  playerRef: React.RefObject<any>
) => {
  const player = playerRef.current?.internalPlayer;
  if (player) {
    if (isRepeatOne) {
      player.playVideo();
    } else {
      playNextVideo();
    }
  }
};

export const playNextVideo = (
  videoTracks: Video[],
  currentVideo: Video,
  setCurrentVideo: React.Dispatch<React.SetStateAction<Video>>,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  isShuffle: boolean,
  playerRef: React.RefObject<any>
) => {
  let nextVideo;
  if (isShuffle) {
    nextVideo = videoTracks[Math.floor(Math.random() * videoTracks.length)];
  } else {
    const currentIndex = videoTracks.findIndex(
      (video) => video.id === currentVideo.id
    );
    nextVideo = videoTracks[(currentIndex + 1) % videoTracks.length];
  }
  setCurrentVideo(nextVideo);
  setIsPlaying(true);
  const player = playerRef.current?.internalPlayer;
  if (player) {
    player.playVideo();
  }
};

export const playPreviousVideo = (
  videoTracks: Video[],
  currentVideo: Video,
  setCurrentVideo: React.Dispatch<React.SetStateAction<Video>>,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  playerRef: React.RefObject<any>
) => {
  const currentIndex = videoTracks.findIndex(
    (video) => video.id === currentVideo.id
  );
  const prevIndex =
    (currentIndex - 1 + videoTracks.length) % videoTracks.length;
  setCurrentVideo(videoTracks[prevIndex]);
  setIsPlaying(true);
  const player = playerRef.current?.internalPlayer;
  if (player) {
    player.playVideo();
  }
};

export const playSelectedVideo = (
  id: string,
  videoTracks: Video[],
  setCurrentVideo: React.Dispatch<React.SetStateAction<Video>>,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const selectedVideo = videoTracks.find((video) => video.id === id);
  if (selectedVideo) {
    setCurrentVideo(selectedVideo);
    setIsPlaying(true);
  }
};
