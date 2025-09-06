package com.app.chess.Pieces;
import java.util.List;

import com.app.chess.*;

public class Knight extends Piece {
    public Knight(Player color) {
        super(PieceType.KNIGHT, color);
    }

    public Knight() {
        super(PieceType.KNIGHT);
    }

    @Override
    public List<int []> getPsuedoLegalMoves(Board board, int[] fromPos) {
        List<int[]> directions = List.of(
            new int[]{2,1}, new int[]{2,-1},
            new int[]{1,2}, new int[]{-1,2},
            new int[]{-2,1}, new int[]{-2,-1},
            new int[]{1,-2}, new int[]{-1,2}
        );
        return getSteppingMoves(directions, board, fromPos);
    }

    @Override
    public Piece deepCopy() {
        Bishop copy = new Bishop(this.color);
        copy.hasMoved = this.hasMoved;
        return copy;
    }
}
