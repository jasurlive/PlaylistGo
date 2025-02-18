import React from 'react';
import '../add/css/header.css';

const Header = () => {
    return (


        <div className="header" onClick={() => window.location.href = "/DJ"}>
            <div className="logo-text">DJ's playlist ツ 🖤🎧</div>
        </div>
    );
};

export default Header;
