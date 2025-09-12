import React from "react";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import "../../../css/buttons.css";
import Shortcuts from "../Shortcuts";

interface FullScreenComponentProps {
  isFullScreen: boolean;
  toggleFullScreen: () => void;
}

const FullScreenComponent: React.FC<FullScreenComponentProps> = ({
  isFullScreen,
  toggleFullScreen,
}) => {
  return (
    <>
      <button
        className="fullscreen-button"
        id="fullscreen"
        onClick={toggleFullScreen}
      >
        {isFullScreen ? <BsFullscreenExit /> : <BsFullscreen />}
      </button>
      <Shortcuts onToggleFullScreen={toggleFullScreen} />
    </>
  );
};

export default FullScreenComponent;
