import { FiHome, FiMaximize, FiMinimize } from "react-icons/fi";
import { GiMusicalNotes } from "react-icons/gi";
import { FcIdea } from "react-icons/fc";
import { useState } from "react";
import "../../css/nav-menu.css";
import Playlist from "../../../Playlist";
import { Video } from "../playlist/types";

interface NavMenuProps {
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

const NavMenu: React.FC<NavMenuProps> = ({
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
  currentVideo,
  playSelectedVideo,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleNavClick = (section: string) => {
    if (isModalOpen && modalContent === section) {
      setIsModalOpen(false);
      setModalContent("");
    } else {
      setModalContent(section);
      setIsModalOpen(true);
    }
  };

  const handleMainClick = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div>
      <div className="bottom-nav">
        <button onClick={handleMainClick}>
          <FiHome size={24} />
          Main
        </button>
        <button onClick={() => handleNavClick("Playlists")}>
          <GiMusicalNotes size={24} />
          Playlists
        </button>
        <button onClick={() => (window.location.href = "https://jasurlive.uz")}>
          <FcIdea size={24} />
          Got an idea?
        </button>
        <button onClick={toggleFullScreen}>
          {isFullScreen ? <FiMinimize size={24} /> : <FiMaximize size={24} />}
          {isFullScreen ? "Mini" : "Full Screen"}
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {modalContent === "Playlists" && (
              <Playlist
                customSongs={customSongs}
                jasursList={jasursList}
                currentVideoId={currentVideo.id}
                playSelectedVideo={playSelectedVideo}
                setCustomSongs={setCustomSongs}
                setJasursList={setJasursList}
              />
            )}
            {modalContent === "Feedback" && null}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavMenu;
