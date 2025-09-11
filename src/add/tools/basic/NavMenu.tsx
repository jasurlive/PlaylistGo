import "../../css/nav-menu.css";
import Playlist from "../../../Playlist";
import { NavMenuProps } from "../types/interface";
import Shortcuts from "../player/Shortcuts";
import PlaylistToggle from "../player/controls/playlistToggle";
import ModalToggle from "../player/controls/modalToggle";

const NavMenu: React.FC<NavMenuProps> = ({
  customList,
  adminsList,
  currentVideo,
  playSelectedVideo,
  setcustomList,
  setadminsList,
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
                  customList={customList}
                  adminsList={adminsList}
                  currentVideoId={currentVideo.id}
                  playSelectedVideo={playSelectedVideo}
                  setcustomList={setcustomList}
                  setadminsList={setadminsList}
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
