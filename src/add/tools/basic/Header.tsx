import '../../css/header.css';

const Header = () => {
    return (
        <div className="header" onClick={() => window.location.href = "/"}>
            <div className="logo-text">DJ's playlist ツ 🖤🎧</div>
        </div>
    );
};

export default Header;
