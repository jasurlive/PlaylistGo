import PlaylistSection from "./add/tools/playlist/PlaylistSection";
import { PlaylistProps } from "./add/tools/types/interface";

const Playlist: React.FC<PlaylistProps> = ({
  customList,
  adminsList,
  currentVideoId,
  setcustomList,
  setadminsList,
  playSelectedVideo,
}) => {
  const deleteSong = (id: string, isCustom: boolean) => {
    if (isCustom) {
      setcustomList((prev) => prev.filter((song) => song.id !== id));
    } else {
      setadminsList((prev) => prev.filter((song) => song.id !== id));
    }
  };

  return (
    <div className="playlists-container">
      <PlaylistSection
        title="Random Playlist"
        songs={adminsList}
        setSongs={setadminsList} //for drag n drop function
        currentVideoId={currentVideoId}
        deleteSong={(id) => deleteSong(id, false)}
        playSelectedVideo={playSelectedVideo}
      />
      <PlaylistSection
        title="Your Playlist"
        songs={customList}
        setSongs={setcustomList}
        currentVideoId={currentVideoId}
        deleteSong={(id) => deleteSong(id, true)}
        playSelectedVideo={playSelectedVideo}
      />
    </div>
  );
};

export default Playlist;
