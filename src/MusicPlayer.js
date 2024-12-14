// src/components/MusicPlayer.js
import React from 'react';
import Player from './Player';
import UpDown from './UpDown';
import SnowFall from './SnowFall';

const MusicPlayer = () => {
    return (
        <div>
            <SnowFall />
            <Player />
            <UpDown />
        </div>
    );
};

export default MusicPlayer;
