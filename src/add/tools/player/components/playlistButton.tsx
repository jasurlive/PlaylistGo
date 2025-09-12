import React from "react";
import { BsChevronCompactUp, BsChevronCompactDown } from "react-icons/bs";

interface PlaylistToggleProps {
  isModalOpen: boolean;
  onToggle: () => void;
}

const PlaylistButton: React.FC<PlaylistToggleProps> = ({
  isModalOpen,
  onToggle,
}) => {
  return (
    <button onClick={onToggle}>
      {isModalOpen ? (
        <BsChevronCompactDown size={24} />
      ) : (
        <BsChevronCompactUp size={24} />
      )}
      Playlists
    </button>
  );
};

export default PlaylistButton;
