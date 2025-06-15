import React, { useState, useRef } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import Square from './Square';
import '../styles/board.css';
import Game from '../engine/Game.js'

const game = new Game();
const initialBoard = game.start()

const Chessboard = () => {
    const [board, setBoard] = useState(initialBoard);

    // Handle piece movement on drag end
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return; // No valid drop target

        const [fromRow, fromCol] = active.id.split('-').map(Number);
        const [toRow, toCol] = over.id.split('-').map(Number);
        console.log(`Moving piece from ${fromRow},${fromCol} to ${toRow},${toCol}`);
        // Update board state
        const newBoard = game.playMove([fromRow, fromCol], [toRow, toCol]);
        // const newBoard = board.map(row => [...row]); // Deep copy
        // newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
        // newBoard[fromRow][fromCol] = '';
        setBoard(newBoard);
    };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <div className="board">
            {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => (
                    <Square key={`${rowIndex}-${colIndex}`} id={`${rowIndex}-${colIndex}`} piece={piece} />
                ))
            )}
        </div>
    </DndContext>
  );
};

export default Chessboard;