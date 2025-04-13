import PlaylistSection from "./add/tools/playlist/PlaylistSection";
import { PlaylistProps } from "./add/tools/types/interface";

const Playlist: React.FC<PlaylistProps> = ({
  customSongs,
  jasursList,
  currentVideoId,
  playSelectedVideo,
  setCustomSongs,
  setJasursList,
}) => {
  const deleteSong = (id: string, isCustom: boolean) => {
    if (isCustom) {
      setCustomSongs((prev) => prev.filter((song) => song.id !== id));
    } else {
      setJasursList((prev) => prev.filter((song) => song.id !== id));
    }
  };

  return (
    <div className="playlists-container">
      {customSongs.length === 0 ? (
        <PlaylistSection
          title="Empty Playlist. Add some songs using YouTube search!"
          songs={customSongs}
          setSongs={setCustomSongs}
          currentVideoId={currentVideoId}
          playSelectedVideo={playSelectedVideo}
          deleteSong={(id) => deleteSong(id, true)}
        />
      ) : (
        <PlaylistSection
          title="Your Playlist"
          songs={customSongs}
          setSongs={setCustomSongs}
          currentVideoId={currentVideoId}
          playSelectedVideo={playSelectedVideo}
          deleteSong={(id) => deleteSong(id, true)}
        />
      )}
      <PlaylistSection
        title="Random Playlist"
        songs={jasursList}
        setSongs={setJasursList}
        currentVideoId={currentVideoId}
        playSelectedVideo={playSelectedVideo}
        deleteSong={(id) => deleteSong(id, false)}
      />
    </div>
  );
};

export default Playlist;
