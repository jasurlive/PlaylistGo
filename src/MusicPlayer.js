// src/components/MusicPlayer.js
import React from 'react';
import Player from './Player';
import UpDown from './UpDown'; // Import UpDown component

const MusicPlayer = () => {
    return (
        <div>
            <Player />
            <UpDown /> {/* Add the UpDown component */}
        </div>
    );
};

export default MusicPlayer;
