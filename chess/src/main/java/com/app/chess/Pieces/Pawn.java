package com.app.chess.Pieces;

import com.app.chess.*;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;

public class Pawn extends Piece {
    public Pawn(Player color) {
        super(PieceType.PAWN, color);
    }

    public Pawn() {
        super(PieceType.PAWN);
    }

    @Override
    public List<int []> getPsuedoLegalMoves(Board board, int[] fromPos, boolean attack) {
        List<int[]> legalMoves = new ArrayList<>();
        int direction = (color == Player.WHITE) ? -1 : 1; // White moves up (-1), Black moves down (+1)

        List<int[]> forwardMoves = hasMoved ? List.of(new int[]{direction, 0}) 
                                            : List.of(new int[]{direction, 0}, new int[]{2 * direction, 0});

        if (!attack) {
            for (int[] move : forwardMoves) {
                int[] nextPos = {fromPos[0] + move[0], fromPos[1] + move[1]};
                if (board.isInsideBoard(nextPos) && board.getPieceAt(nextPos) == null) {
                    legalMoves.add(nextPos);
                } else {
                    break; // Stop if blocked
                }
            }
        }

        // Capture moves
        int[][] captureOffsets = {{direction, -1}, {direction, 1}};
        for (int[] offset : captureOffsets) {
            int[] capturePos = {fromPos[0] + offset[0], fromPos[1] + offset[1]};
            if (board.isInsideBoard(capturePos)) {
                Piece targetPiece = board.getPieceAt(capturePos);
                if ((targetPiece != null && targetPiece.color != color)
                    || (Arrays.equals(board.enPassantTarget, capturePos))) {
                    legalMoves.add(capturePos);
                }
            }
        }
        return legalMoves;
    }
    
    @Override
    public Piece deepCopy() {
        Pawn copy = new Pawn(this.color);
        copy.hasMoved = this.hasMoved;
        return copy;
    }
}
