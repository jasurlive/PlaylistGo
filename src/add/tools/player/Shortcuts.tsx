import { useEffect } from 'react';

interface ShortcutsProps {
    onSearchFocus: () => void;
    onPlayPauseToggle: () => void;
    onPlayPrevious: () => void;
    onPlayNext: () => void;
    onToggleShuffle: () => void;
    onToggleFullScreen?: () => void;
    onToggleRepeatOne: () => void;
}

const Shortcuts: React.FC<ShortcutsProps> = ({
    onSearchFocus,
    onPlayPauseToggle,
    onPlayPrevious,
    onPlayNext,
    onToggleShuffle,
    onToggleFullScreen,
    onToggleRepeatOne,
}) => {
    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            const isInputFocused = document.activeElement?.tagName === 'INPUT';

            if (isInputFocused || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
                return;
            }

            switch (event.key) {
                case 's':
                    event.preventDefault();
                    onSearchFocus();
                    break;
                case 'k':
                case '5':
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
                case 'r':
                case 'w':
                case '1':
                    onToggleRepeatOne();
                    break;
                case 'f':
                    event.preventDefault();
                    onToggleFullScreen?.();
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeydown);

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
        onToggleRepeatOne,
    ]);

    return null;
};

export default Shortcuts;
