import PlaylistSection from "./add/tools/playlist/PlaylistSection";
import { Video } from "./add/tools/playlist/types";

interface PlaylistProps {
  customSongs: Video[];
  jasursList: Video[];
  currentVideoId: string;
  playSelectedVideo: (id: string) => void;
  setCustomSongs: React.Dispatch<React.SetStateAction<Video[]>>;
  setJasursList: React.Dispatch<React.SetStateAction<Video[]>>;
}

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
      <PlaylistSection
        title="Your Playlist"
        songs={customSongs}
        setSongs={setCustomSongs}
        currentVideoId={currentVideoId}
        playSelectedVideo={playSelectedVideo}
        deleteSong={(id) => deleteSong(id, true)}
      />
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
