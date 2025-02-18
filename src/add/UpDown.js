// src/components/UpDown.js
import React, { useState, useEffect } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import '../add/css/player.css';

const UpDown = () => {
    const [isTop, setIsTop] = useState(true);
    const [isBottom, setIsBottom] = useState(false);
    const [scrollDirection, setScrollDirection] = useState('down');

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            const atTop = currentScrollY <= 1;
            const atBottom = windowHeight + currentScrollY >= documentHeight - 2;

            setIsTop(atTop);
            setIsBottom(atBottom);

            if (!atTop && !atBottom) {
                setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollTo = () => {
        if (isBottom) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (isTop || scrollDirection === 'down') {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="updown-button" onClick={scrollTo}>
            {isTop || (!isBottom && scrollDirection === 'down') ? (
                <FaChevronDown className="updown-icon" />
            ) : (
                <FaChevronUp className="updown-icon" />
            )}
        </div>
    );
};

export default UpDown;

