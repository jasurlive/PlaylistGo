import '../../css/header.css';

const Header = () => {
    return (
        <div className="header-logo" onClick={() => window.location.href = "/"}>
            <div className="logo-text">🎧 playlistgo.vercel.app ツ🖤</div>
        </div>
    );
};

export default Header;
