package com.app.chess;

import com.app.chess.Pieces.Piece;

public class Game {
    Board board;
    String currentTurn;
    boolean gameOver;
    String winner;

    public Game() {
         board = new Board();
         currentTurn = "white";
         gameOver = false;
         winner = null;
    }

    public String[][] start() {
        board.initialize();
        board.printBoard();
        return  board.getBoard();
    }

    public String[][] playMove(Number[] fromPos, Number[] toPos) {
        if (fromPos == toPos) {
            System.out.println("Invalid move: Source and destination are the same.");
            return board.getBoard();
        }

        Piece pieceAtFrom = board.getPieceAt(fromPos);
        
        if (pieceAtFrom == null) {
            System.out.println("Invalid move: No piece at source position.");
            return board.getBoard();
        }
        
        if (pieceAtFrom.color != currentTurn) {
            System.out.println("Wrong turn: Piece does not belong to current player.")
            return board.getBoard();
        }

        

    }


}
