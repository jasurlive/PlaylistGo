import PlaylistSection from "./add/tools/playlist/PlaylistSection";
import { PlaylistProps } from "./add/tools/types/interface";

const Playlist: React.FC<PlaylistProps> = ({
  customList,
  adminList,
  currentVideoId,
  setcustomList,
  setadminList,
  playSelectedVideo,
}) => {
  const deleteSong = (id: string, isCustom: boolean) => {
    if (isCustom) {
      setcustomList((prev) => prev.filter((song) => song.id !== id));
    } else {
      setadminList((prev) => prev.filter((song) => song.id !== id));
    }
  };

  return (
    <div className="playlists-container">
      <PlaylistSection
        title="Random Playlist"
        songs={adminList} //generates the songs from excel sheet. check "public/python/songs.xlsx"
        setSongs={setadminList} //for drag n drop function
        currentVideoId={currentVideoId} //needed to highlight (animate) the current playing song item
        deleteSong={(id) => deleteSong(id, false)} //deletes the song from admin list
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
