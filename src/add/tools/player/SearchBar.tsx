import { useRef, useEffect } from "react";
import { FaPlus, FaCheckCircle } from "react-icons/fa";
import { SlClose } from "react-icons/sl";
import "../../css/searchbar.css";
import { BsSearchHeart } from "react-icons/bs";
import { SearchBarProps } from "../types/interface";

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  searchYouTube,
  searchResults,
  addedSongs,
  addSongFromSearch,
  clearSearch,
}) => {
  const resultsRef = useRef<HTMLDivElement>(null);

  const closeSearchResults = () => {
    clearSearch();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        clearSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
          onKeyDown={(e) => e.key === "Enter" && searchYouTube()}
        />
        <button onClick={searchYouTube}>
          <BsSearchHeart />
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="search-results" ref={resultsRef}>
          <div className="search-results-header">
            <h3>Search Results</h3>
            <SlClose onClick={closeSearchResults} className="close-icon" />
          </div>
          {searchResults.map((result) => (
            <div key={result.id} className="search-result-item">
              <img
                src={result.thumbnail}
                alt={result.title}
                className="thumbnail"
              />
              <span className="search-result-title">{result.title}</span>
              <button onClick={() => addSongFromSearch(result)}>
                {addedSongs.has(result.url) ? <FaCheckCircle /> : <FaPlus />}
                <span>{addedSongs.has(result.url) ? "Added" : "Add"}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
