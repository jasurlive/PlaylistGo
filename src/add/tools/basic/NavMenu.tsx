import { FiHome, FiMaximize, FiMinimize } from "react-icons/fi";
import { GiMusicalNotes } from "react-icons/gi";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";
import { IoIosTimer } from "react-icons/io"; // Added import for timer icon
import { useState, useEffect } from "react";
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
              // Logic to finish the last song
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

  const handleNavClick = (section: string) => {
    if (isModalOpen && modalContent === section) {
      setIsModalOpen(false);
      setModalContent("");
      setActiveButton(""); // Clear active state
    } else {
      setModalContent(section);
      setIsModalOpen(true);
      setActiveButton(section); // Set active state
    }
  };

  const handleMainClick = () => {
    setIsModalOpen(false);
    setModalContent("");
    setActiveButton("Main"); // Set active state
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
      document.exitFullscreen(); // Call the function instead of checking its reference
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
