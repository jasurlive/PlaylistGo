import { useState, useEffect } from "react";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";

import "../../../css/buttons.css";

interface AddFavoritesProps {
  isFavorite: boolean;
  toggleFavorite: () => void;
}

function AddFavorites() {
  // 🔹 load initial favorite state from localStorage
  const [isFavorite, setIsFavorite] = useState<boolean>(() => {
    const stored = localStorage.getItem("favorite");
    return stored === "true"; // default false if not set
  });

  useEffect(() => {
    localStorage.setItem("favorite", String(isFavorite));
  }, [isFavorite]);

  function toggleFavorite() {
    setIsFavorite((prev) => !prev);
  }

  return (
    <button
      className={`favorite-button ${isFavorite ? "active" : ""}`}
      id="favorite"
      onClick={toggleFavorite}
    >
      {isFavorite ? <BsSuitHeartFill /> : <BsSuitHeart />}
    </button>
  );
}

export default AddFavorites;
