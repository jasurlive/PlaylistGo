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
            // Check if the active element is an input field
            const isInputFocused = document.activeElement.tagName === 'INPUT';

            // If the input is focused, do not execute any shortcuts
            if (isInputFocused) {
                return; // Exit the function early
            }

            // Shortcuts functionality
            switch (event.key) {
                case 's':
                    event.preventDefault(); // Prevent "s" from appearing in the input field
                    onSearchFocus(); // Focus the search input only if it's not already focused
                    break;
                case 'k':
                    onPlayPauseToggle();
                    break;
                case 'ArrowLeft': // Use ArrowLeft for Play Previous
                    onPlayPrevious();
                    break;
                case 'ArrowRight': // Use ArrowRight for Play Next
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
