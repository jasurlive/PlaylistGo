import React from "react";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import "../../../css/buttons.css";
import { FullScreenComponentProps } from "../../types/interface";
import Shortcuts from "../Shortcuts";

const FullScreenComponent: React.FC<FullScreenComponentProps> = ({
  isFullScreen,
  setIsFullScreen,
}) => {
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

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
