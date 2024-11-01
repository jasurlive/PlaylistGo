// src/components/Shortcuts.js
import { useEffect } from 'react';

const Shortcuts = ({
    onSearchFocus,
    onPlayPauseToggle,
    onPlayPrevious,
    onPlayNext,
    onToggleShuffle,
    onToggleFullScreen,
}) => {
    useEffect(() => {
        const handleKeydown = (event) => {
            // Check if the active element is not the input field
            const isInputFocused = document.activeElement.tagName === 'INPUT';

            if (event.key === 's') {
                // Only prevent the default behavior if the input isn't focused
                if (!isInputFocused) {
                    event.preventDefault(); // Prevent "s" from appearing in the input field
                    onSearchFocus(); // Focus the search input only if it's not already focused
                }
            } else {
                switch (event.key) {
                    case 'k':
                        onPlayPauseToggle();
                        break;
                    case '4':
                        onPlayPrevious();
                        break;
                    case '6':
                        onPlayNext();
                        break;
                    case 'q':
                        onToggleShuffle();
                        break;
                    case 'f':
                        onToggleFullScreen();
                        break;
                    default:
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeydown);

        // Cleanup event listener on unmount
        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
    }, [
        onSearchFocus,
        onPlayPauseToggle,
        onPlayPrevious,
        onPlayNext,
        onToggleShuffle,
        onToggleFullScreen,
    ]);

    return null; // This component does not render anything
};

export default Shortcuts;
