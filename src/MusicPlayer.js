// src/components/MusicPlayer.js
import React from 'react';
import Player from './Player';
import UpDown from './UpDown';
import Snowfall from "react-snowfall";

const MusicPlayer = () => {
    return (
        <div>
            <Snowfall
                color="white"       // Snowflake color
                snowflakeCount={100} // Number of snowflakes
                radius={[0, 6]}      // Radius (size range) of snowflakes (ensure this is an array)
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1000,        // Ensure snowfall stays behind content
                }}
            />
            <Player />
            <UpDown /> {/* UpDown component */}
        </div>
    );
};

export default MusicPlayer;
