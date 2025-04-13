import React from "react";
import YouTube from "react-youtube";
import { YTPlayerProps } from "../types/interface";

const opts = {
  playerVars: {
    autoplay: 1,
    controls: 1,
    modestbranding: 1,
    rel: 0,
  },
};

export const extractVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v");
    }
  } catch (e) {
    return null;
  }
  return null;
};

const YTPlayer: React.FC<YTPlayerProps> = ({
  currentVideoId,
  videoTracks,
  onVideoEnd,
  playerRef,
  autoplay,
}) => {
  const video = videoTracks.find((video) => video.id === currentVideoId);
  const videoId = video ? extractVideoId(video.url) : "";

  const playerOpts = {
    ...opts,
    playerVars: {
      ...opts.playerVars,
      autoplay: autoplay ? 1 : 0,
    },
  };

  const onVideoEndHandler = () => {
    onVideoEnd();
  };

  return (
    <div>
      <YouTube
        key={videoId}
        videoId={videoId || ""}
        opts={playerOpts}
        onEnd={onVideoEndHandler}
        ref={playerRef}
        onReady={(event) => {
          playerRef.current = event.target;
        }}
      />
    </div>
  );
};

export default YTPlayer;
