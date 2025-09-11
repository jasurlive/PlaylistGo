import "../../css/nav-menu.css";
import Playlist from "../../../Playlist";
import { NavMenuProps } from "../types/interface";
import Shortcuts from "../player/Shortcuts";
import PlaylistToggle from "../player/controls/playlistButton";
import ModalToggle from "../player/controls/modalToggle";

const NavMenu: React.FC<NavMenuProps> = ({
  customList,
  adminList,
  currentVideo,
  playSelectedVideo,
  setcustomList,
  setadminList,
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
                  adminList={adminList}
                  currentVideoId={currentVideo.id}
                  playSelectedVideo={playSelectedVideo}
                  setcustomList={setcustomList}
                  setadminList={setadminList}
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
