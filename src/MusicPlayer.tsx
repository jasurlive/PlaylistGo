// src/components/MusicPlayer.js
import React from "react";
import Player from "./Player";
import UpDown from "./add/tools/basic/UpDown";
import SnowFall from "./add/tools/basic/SnowFall";
import Online from "./add/tools/basic/Online";
import Footer from "./add/tools/basic/Footer";
import Header from "./add/tools/basic/Header";

const MusicPlayer = () => {
  return (
    <div>
      <Header />
      <Player />
      <UpDown />
      <Online />
      <Footer />
    </div>
  );
};

export default MusicPlayer;
