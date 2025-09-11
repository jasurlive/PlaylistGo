import PlaylistSection from "./add/tools/playlist/PlaylistSection";
import { PlaylistProps } from "./add/tools/types/interface";

const Playlist: React.FC<PlaylistProps> = ({
  customSongs,
  jasursList,
  currentVideoId,
  setCustomSongs,
  setJasursList,
}) => {
  const deleteSong = (id: string, isCustom: boolean) => {
    if (isCustom) {
      setCustomSongs?.((prev) => prev.filter((song) => song.id !== id));
    } else {
      setJasursList?.((prev) => prev.filter((song) => song.id !== id));
    }
  };

  return (
    <div className="playlists-container">
      <PlaylistSection
        title="Random Playlist"
        songs={jasursList}
        setSongs={setJasursList}
        currentVideoId={currentVideoId}
        deleteSong={(id) => deleteSong(id, false)}
      />
      <PlaylistSection
        title="Your Playlist"
        songs={customSongs}
        setSongs={setCustomSongs}
        currentVideoId={currentVideoId}
        deleteSong={(id) => deleteSong(id, true)}
      />
    </div>
  );
};

export default Playlist;
