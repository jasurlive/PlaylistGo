
import React from 'react';
import Snowfall from "react-snowfall";

const SnowFall = () => {
    return (
        <Snowfall
            color="white"
            snowflakeCount={100}
            radius={[0, 6]}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1000,
            }}
        />
    );
};

export default SnowFall;
