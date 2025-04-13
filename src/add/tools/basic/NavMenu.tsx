import { FiHome, FiMaximize, FiMinimize } from "react-icons/fi";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";
import { IoIosTimer } from "react-icons/io";
import { useState, useEffect } from "react";
import "../../css/nav-menu.css";
import Playlist from "../../../Playlist";
import { NavMenuProps } from "../types/interface";

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
  const [modalContent, setModalContent] = useState<string>("Playlists");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [finishLastSong, setFinishLastSong] = useState(false);
  const [activeButton, setActiveButton] = useState<string>("Main");

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;

    if (timer !== null) {
      setRemainingTime(timer);
      timerInterval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev !== null && prev > 0) {
            return prev - 1;
          } else {
            clearInterval(timerInterval!);
            if (finishLastSong) {
              console.log("Finishing the last song...");
            }
            return null;
          }
        });
      }, 1000);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timer, finishLastSong]);

  useEffect(() => {
    const savedModalState = localStorage.getItem("playlistViewState");
    if (savedModalState) {
      const { isModalOpen, modalContent } = JSON.parse(savedModalState);
      setIsModalOpen(isModalOpen);
      setModalContent(modalContent);
      setActiveButton(isModalOpen ? modalContent : "Main");
    } else {
      setActiveButton("Playlists");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "playlistViewState",
      JSON.stringify({ isModalOpen, modalContent })
    );
  }, [isModalOpen, modalContent]);

  const handleNavClick = (section: string) => {
    if (isModalOpen && modalContent === section) {
      setIsModalOpen(false);
      setModalContent("");
      setActiveButton("");
    } else {
      setModalContent(section);
      setIsModalOpen(true);
      setActiveButton(section);
    }
  };

  const handleMainClick = () => {
    setIsModalOpen(false);
    setModalContent("");
    setActiveButton("Main");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handleSetTimer = () => {
    const userInput = prompt(
      "This function is not active yet! It is under development! 😁⌛ Set timer in seconds:"
    );
    const seconds = parseInt(userInput || "0", 10);
    if (!isNaN(seconds) && seconds > 0) {
      setTimer(seconds);
    }
  };

  return (
    <div>
      <div className="bottom-nav">
        <button
          onClick={handleMainClick}
          className={activeButton === "Main" ? "active" : ""}
        >
          <FiHome size={24} />
          Main
        </button>
        <button
          onClick={() => handleNavClick("Playlists")}
          className={activeButton === "Playlists" ? "active" : ""}
        >
          {isModalOpen && modalContent === "Playlists" ? (
            <IoEyeSharp size={24} />
          ) : (
            <IoEyeOffSharp size={24} />
          )}
          Playlists
        </button>
        <button
          onClick={handleSetTimer}
          className={activeButton === "Timer" ? "active" : ""}
        >
          <IoIosTimer size={24} />
          {remainingTime !== null ? `${remainingTime}s` : "Set Timer"}
        </button>
        <button
          onClick={toggleFullScreen}
          className={activeButton === "FullScreen" ? "active" : ""}
        >
          {isFullScreen ? <FiMinimize size={24} /> : <FiMaximize size={24} />}
          {isFullScreen ? "Mini View" : "Full Screen"}
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
            {modalContent === "Timer" && (
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={finishLastSong}
                    onChange={(e) => setFinishLastSong(e.target.checked)}
                  />
                  Finish last song when timer ends
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavMenu;
