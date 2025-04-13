import React from "react";
import { BsPersonHeart } from "react-icons/bs";
import { ImHeadphones } from "react-icons/im";
import "../../css/title.css";

interface TitleProps {
  title: string;
  isPlaying: boolean;
}

const Title: React.FC<TitleProps> = ({ title, isPlaying }) => {
  const [artist, songTitle] = title.includes(" - ")
    ? title.split(" - ", 2)
    : ["Unknown Artist", title];

  return (
    <div className="title-container">
      <div className="title-name">
        <ImHeadphones className={isPlaying ? "playing" : ""} />

        {songTitle.trim()}
      </div>
      <div className="title-artist">
        <BsPersonHeart />
        {artist.trim()}
      </div>
    </div>
  );
};

export default Title;
