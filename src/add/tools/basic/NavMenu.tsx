import { FiHome } from "react-icons/fi";
import { useState, useEffect } from "react";
import "../../css/nav-menu.css";
import Playlist from "../../../Playlist";
import { NavMenuProps } from "../types/interface";
import { BsChevronCompactUp, BsChevronCompactDown } from "react-icons/bs";
import Shortcuts from "../player/Shortcuts";

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
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [activeButton, setActiveButton] = useState<string>("Playlists");

  useEffect(() => {
    const savedModalState = localStorage.getItem("playlistViewState");
    if (savedModalState) {
      const { isModalOpen } = JSON.parse(savedModalState);
      setIsModalOpen(isModalOpen);
      setActiveButton(isModalOpen ? "Playlists" : "Main");
    } else {
      setActiveButton("Playlists");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("playlistViewState", JSON.stringify({ isModalOpen }));
  }, [isModalOpen]);

  const handleNavClick = (section: string) => {
    if (isModalOpen && activeButton === section) {
      setIsModalOpen(false);
      setActiveButton("");
    } else {
      setIsModalOpen(true);
      setActiveButton(section);
    }
  };

  // toggle function for p shortcut

  const toggleModal = () => {
    setIsModalOpen((prev) => {
      const newState = !prev;
      setActiveButton(newState ? "Playlists" : "");
      return newState;
    });
  };

  return (
    <div>
      <div className="bottom-nav">
        <button
          onClick={() => handleNavClick("Playlists")}
          className={activeButton === "Playlists" ? "active" : ""}
        >
          {isModalOpen && activeButton === "Playlists" ? (
            <BsChevronCompactDown size={24} />
          ) : (
            <BsChevronCompactUp size={24} />
          )}
          Playlists
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Playlist
              customSongs={customSongs}
              jasursList={jasursList}
              currentVideoId={currentVideo.id}
              playSelectedVideo={playSelectedVideo}
              setCustomSongs={setCustomSongs}
              setJasursList={setJasursList}
            />
          </div>
        </div>
      )}

      <Shortcuts onToggleModal={toggleModal} />
    </div>
  );
};

export default NavMenu;
