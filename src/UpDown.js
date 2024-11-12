// src/components/UpDown.js
import React, { useState, useEffect } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import './MusicPlayer.css';

const UpDown = () => {
    const [isTop, setIsTop] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setIsTop(window.scrollY === 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollTo = () => {
        if (isTop) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="updown-button" onClick={scrollTo}>
            {isTop ? <FaChevronDown className="updown-icon" /> : <FaChevronUp className="updown-icon" />}
        </div>
    );
};

export default UpDown;
