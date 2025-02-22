import React, { useRef, useEffect } from 'react';
import { FaPlus, FaCheckCircle, FaTimes } from 'react-icons/fa';
import '../../css/searchbar.css';

interface Video {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
}

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    searchYouTube: () => void;
    searchResults: Video[];
    addedSongs: Set<string>;
    addSongFromSearch: (song: Video) => void;
    clearSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    searchQuery,
    setSearchQuery,
    searchYouTube,
    searchResults,
    addedSongs,
    addSongFromSearch,
    clearSearch
}) => {
    const resultsRef = useRef<HTMLDivElement>(null);

    const closeSearchResults = () => {
        clearSearch();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
                clearSearch();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [clearSearch]);

    return (
        <div className="add-song">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search for a song... (S)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={clearSearch}
                    onKeyDown={(e) => e.key === 'Enter' && searchYouTube()}
                />
                <button onClick={searchYouTube}>🔍Search</button>
            </div>

            {searchResults.length > 0 && (
                <div className="search-results" ref={resultsRef}>
                    <div className="search-results-header">
                        <h3>Search Results</h3>
                        <FaTimes onClick={closeSearchResults} className="close-icon" />
                    </div>
                    {searchResults.map((result) => (
                        <div
                            key={result.id}
                            className="search-result-item"
                        >
                            <img src={result.thumbnail} alt={result.title} className="thumbnail" />
                            <span>{result.title}</span>
                            <button
                                onClick={() => addSongFromSearch(result)}
                                className="button"
                            >
                                {addedSongs.has(result.url) ? <FaCheckCircle /> : <FaPlus />}
                                <span>
                                    {addedSongs.has(result.url) ? 'Added' : 'Add'}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
