import React from "react";

// Load all piece images from assets directory
const pieceImages = import.meta.glob('../assets/*.png', { eager: true });

// Mapping positions to piece IDs
const INITIAL_POSITIONS = {
  "0-0": "wR",
  "0-1": "wN",
  "0-2": "wB",
  "0-3": "wQ",
  "0-4": "wK",
  "0-5": "wB",
  "0-6": "wN",
  "0-7": "wR",
  "1-0": "wP",
  "1-1": "wP",
  "1-2": "wP",
  "1-3": "wP",
  "1-4": "wP",
  "1-5": "wP",
  "1-6": "wP",
  "1-7": "wP",
  "6-0": "bP",
  "6-1": "bP",
  "6-2": "bP",
  "6-3": "bP",
  "6-4": "bP",
  "6-5": "bP",
  "6-6": "bP",
  "6-7": "bP",
  "7-0": "bR",
  "7-1": "bN",
  "7-2": "bB",
  "7-3": "bQ",
  "7-4": "bK",
  "7-5": "bB",
  "7-6": "bN",
  "7-7": "bR"
};

const Tile = ({ row, col, isDark }) => {
  const tileClass = isDark ? "tile dark" : "tile light";
  const pieceId = INITIAL_POSITIONS[`${row}-${col}`];

  // Get the image path if piece exists
  const imagePath = pieceId
    ? Object.entries(pieceImages).find(([path]) => path.includes(`${pieceId}.png`))?.[1].default
    : null;

  return (
    <div className={tileClass}>
      {imagePath && (
        <img
          src={imagePath}
          alt={pieceId}
          className="piece-img"
        />
      )}
    </div>
  );
};

export default Tile;
