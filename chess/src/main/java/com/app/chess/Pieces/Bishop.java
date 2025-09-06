package com.app.chess.Pieces;
import java.util.List;

import com.app.chess.*;

public class Bishop extends Piece {
    public Bishop(Player color) {
        super(PieceType.BISHOP, color);
    }

    public Bishop() {
        super(PieceType.BISHOP);
    }

    @Override
    public List<int []> getPsuedoLegalMoves(Board board, int[] fromPos) {
        List<int[]> directions = List.of(
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
