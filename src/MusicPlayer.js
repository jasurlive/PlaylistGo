// src/components/MusicPlayer.js
import React from 'react';
import Player from './Player';
import UpDown from './add/UpDown';
import SnowFall from './add/SnowFall';
import Online from './add/Online';
import Footer from './add/Footer';

const MusicPlayer = () => {
    return (
        <div>
            <SnowFall />
            <Player />
            <UpDown />
            <Online />
            <Footer />
        </div>
    );
};

export default MusicPlayer;
