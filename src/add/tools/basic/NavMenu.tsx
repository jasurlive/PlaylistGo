import { FiHome, FiSearch } from "react-icons/fi";
import { GiMusicalNotes } from "react-icons/gi";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";
import "../../css/nav-menu.css";

const NavMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");

  const handleNavClick = (section: string) => {
    setModalContent(section);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  return (
    <div>
      <div className="bottom-nav">
        <button onClick={() => handleNavClick("Main")}>
          <FiHome size={24} />
          Main
        </button>
        <button onClick={() => handleNavClick("Playlists")}>
          <GiMusicalNotes size={24} />
          Playlists
        </button>
        <button onClick={() => handleNavClick("Most played")}>
          <FaHeart size={24} />
          Favorites
        </button>
        <button onClick={() => handleNavClick("Search")}>
          <FiSearch size={24} />
          Search
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={handleCloseModal} className="close-button">
              &times;
            </button>
            <h2>{modalContent} Section</h2>
            <p>This is the {modalContent} content inside the modal.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavMenu;
