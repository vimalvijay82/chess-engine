package com.app.chess.Pieces;
import java.util.List;

import com.app.chess.*;

public class Queen extends Piece {
    public Queen(Player color) {
        super(PieceType.QUEEN, color);
    }

    public Queen() {
        super(PieceType.QUEEN);
    }

    @Override
    public List<int []> getPsuedoLegalMoves(Board board, int[] fromPos) {
        List<int[]> directions = List.of(
            new int[]{1,0}, new int[]{-1,0},
            new int[]{0,1}, new int[]{0,-1},
            new int[]{1,1}, new int[]{1,-1},
            new int[]{-1,1}, new int[]{-1,-1}
        );
        return getSlidingMoves(directions, board, fromPos);
    }

    @Override
    public Piece deepCopy() {
        Bishop copy = new Bishop(this.color);
        copy.hasMoved = this.hasMoved;
        return copy;
    }
    
}
