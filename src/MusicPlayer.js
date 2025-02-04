// src/components/MusicPlayer.js
import React from 'react';
import Player from './Player';
import UpDown from './add/UpDown';
import SnowFall from './add/SnowFall';
import Online from './add/Online';
import Footer from './add/Footer';
import Header from './add/Header';

const MusicPlayer = () => {
    return (
        <div>
            <Header />
            <SnowFall />
            <Player />
            <UpDown />
            <Online />
            <Footer />
        </div>
    );
};

export default MusicPlayer;
