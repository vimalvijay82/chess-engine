package com.app.chess.Pieces;

import com.app.chess.*;
import java.util.List;
import java.util.HashMap;

public class King extends Piece {
    public King(Player color) {
        super(PieceType.KING, color);
    }

    public King() {
        super(PieceType.KING);
    }

    @Override
    public List<int []> getPsuedoLegalMoves(Board board, int[] fromPos, boolean attack) {
        List<int[]> offsets = List.of(
            new int[]{1,0}, new int[]{-1,0},
            new int[]{0,1}, new int[]{0,-1},
            new int[]{1,1}, new int[]{1,-1},
            new int[]{-1,1}, new int[]{-1,-1}
        );

        List<int[]> kingAllMoves = getSteppingMoves(offsets, board, fromPos);

        // Castling moves
        if(!attack) {
            HashMap<Player, HashMap<String, int[]>> squareForCastling;
            squareForCastling = new HashMap<>();
            squareForCastling.put(Player.WHITE, new HashMap<>() {{
                put("kingSide", new int[]{7,6});
                put("queenSide", new int[]{7,2});
            }});
            squareForCastling.put(Player.BLACK, new HashMap<>() {{
                put("kingSide", new int[]{0,6});
                put("queenSide", new int[]{0,2});
            }});

            if (board.canCastle(color, "kingSide")) {
                int[] kingSidePos = squareForCastling.get(color).get("kingSide");
                kingAllMoves.add(kingSidePos);
            }
            if (board.canCastle(color, "queenSide")) {
                int[] queenSidePos = squareForCastling.get(color).get("queenSide");
                kingAllMoves.add(queenSidePos);
            }
        }
        return kingAllMoves;
    }

    @Override
    public Piece deepCopy() {
        King copy = new King(this.color);
        copy.hasMoved = this.hasMoved;
        return copy;
    }
}
