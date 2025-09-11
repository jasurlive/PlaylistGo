import "../../css/nav-menu.css";
import Playlist from "../../../Playlist";
import { NavMenuProps } from "../types/interface";
import Shortcuts from "../player/Shortcuts";
import PlaylistToggle from "../player/controls/playlistToggle";
import ModalToggle from "../player/controls/modalToggle";

const NavMenu: React.FC<NavMenuProps> = ({
  customSongs,
  jasursList,
  currentVideo,
}) => {
  return (
    <ModalToggle storageKey="playlistViewState" defaultOpen={true}>
      {(isModalOpen, handleToggle) => (
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
                />
              </div>
            </div>
          )}
        </div>
      )}
    </ModalToggle>
  );
};

export default NavMenu;
