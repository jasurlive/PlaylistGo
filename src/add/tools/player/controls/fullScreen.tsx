import React from "react";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import "../../../css/buttons.css";

interface FullScreenComponentProps {
  isFullScreen: boolean;
  setIsFullScreen: (value: boolean) => void;
}

const FullScreenComponent: React.FC<FullScreenComponentProps> = ({
  isFullScreen,
  setIsFullScreen,
}) => {
  return (
    <button
      className="fullscreen-button"
      onClick={() => setIsFullScreen(!isFullScreen)}
    >
      {isFullScreen ? <BsFullscreenExit /> : <BsFullscreen />}
    </button>
  );
};

export default FullScreenComponent;
