import React, { useState, useEffect } from 'react';
import Snowfall from "react-snowfall";
import snowflakeImage from '../img/snow.png'; // Adjust the path if necessary

const SnowFall = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const img = new Image();
        img.src = snowflakeImage;
        img.onload = () => setImages([img]);
    }, []);

    if (images.length === 0) {
        return null; // or a loading spinner
    }

    return (
        <Snowfall
            snowflakeCount={15} // Number of snowflakes
            radius={[0, 20]}      // Radius (size range) of snowflakes (ensure this is an array)
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1000,        // Ensure snowfall stays behind content
            }}
            images={images}
        />
    );
};

export default SnowFall;