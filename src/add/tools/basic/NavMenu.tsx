import { useState, useEffect } from "react";
import "../../css/nav-menu.css";
import Playlist from "../../../Playlist";
import { NavMenuProps } from "../types/interface";
import Shortcuts from "../player/Shortcuts";
import PlaylistToggle from "../player/controls/playlistToggle";

const NavMenu: React.FC<NavMenuProps> = ({
  customSongs,
  jasursList,
  setCustomSongs,
  setJasursList,
  currentVideo,
  playSelectedVideo,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    const savedModalState = localStorage.getItem("playlistViewState");
    if (savedModalState) {
      const { isModalOpen } = JSON.parse(savedModalState);
      setIsModalOpen(isModalOpen);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("playlistViewState", JSON.stringify({ isModalOpen }));
  }, [isModalOpen]);

  const handleToggle = () => setIsModalOpen((prev) => !prev);

  return (
    <div>
      <div className="bottom-nav">
        <PlaylistToggle isModalOpen={isModalOpen} onToggle={handleToggle} />
        <Shortcuts onToggleModal={handleToggle} />
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
    </div>
  );
};

export default NavMenu;
