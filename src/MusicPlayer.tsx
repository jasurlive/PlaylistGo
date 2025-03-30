import Player from "./Player";
import UpDown from "./add/tools/basic/UpDown";
import SnowFall from "./add/tools/basic/SnowFall";
import Online from "./add/tools/basic/Online";
import Footer from "./add/tools/basic/Footer";
import Header from "./add/tools/basic/Header";
import Social from "./add/tools/basic/Social";

const MusicPlayer = () => {
  return (
    <div>
      <Header />
      <Player />
      <Social />
    </div>
  );
};

export default MusicPlayer;
