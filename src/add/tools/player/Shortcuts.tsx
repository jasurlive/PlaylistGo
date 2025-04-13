import { useEffect } from "react";
import { ShortcutsProps } from "../types/interface";

const Shortcuts: React.FC<ShortcutsProps> = ({
  onSearchFocus,
  onPlayPauseToggle,
  onPlayPrevious,
  onPlayNext,
  onToggleShuffle,
  onToggleRepeatOne,
}) => {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const isInputFocused = document.activeElement?.tagName === "INPUT";

      if (
        isInputFocused ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey ||
        event.metaKey
      ) {
        return;
      }

      switch (event.key) {
        case "s":
          event.preventDefault();
          onSearchFocus();
          break;
        case "k":
        case "5":
          onPlayPauseToggle();
          break;
        case "4":
          onPlayPrevious();
          break;
        case "6":
          onPlayNext();
          break;
        case "q":
          onToggleShuffle();
          break;
        case "r":
        case "w":
        case "1":
          onToggleRepeatOne();
          break;
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [
    onSearchFocus,
    onPlayPauseToggle,
    onPlayPrevious,
    onPlayNext,
    onToggleShuffle,
    onToggleRepeatOne,
  ]);

  return null;
};

export default Shortcuts;
