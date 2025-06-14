import React from "react";
import Tile from "./Tile";
import "../styles/board.css";

const ChessBoard = () => {
  const board = [];

  for (let row = 7; row >= 0; row--) {
        for (let col = 0; col < 8; col++) {
            const isDark = (row + col) % 2 === 1;
            board.push(
                <Tile
                    key={`${row}-${col}`}
                    row={row}
                    col={col}
                    isDark={!isDark}
                />
            );
        }
  }

  return <div className="board">{board}</div>;
};

export default ChessBoard;
