package com.app.chess.Pieces;
import com.app.chess.*;

import java.util.List;
import java.util.ArrayList;

public class Piece {
    public PieceType type;
    public Player color;
    public boolean hasMoved;

    public Piece(PieceType ptype, Player pcolor) {
        type = ptype;
        color = pcolor;
        hasMoved = false;
    }

    public Piece(PieceType ptype) {
        type = ptype;
        color = null;
        hasMoved = false;
    }

    public Piece() {
        type = null;
        color = null;
        hasMoved = false;
    }

    public List<int []> getPsuedoLegalMoves(Board board, int[] position) {
        // This method should be overridden in each specific piece class
        return List.of();
    }

    public List<int []> getPsuedoLegalMoves(Board board, int[] position, boolean attack) {
        // This method should be overridden in each specific piece class
        return List.of();
    }

    public Piece deepCopy() {
        // This method should be overridden in each specific piece class
        return new Piece();
    }

    public Piece setPlayer(Player color) {
        this.color = color;
        return this;
    }

    protected List<int []> getSlidingMoves(List<int []> directions, Board board, int[] fromPos) {
        List <int []> legalMoves = new ArrayList<>();
        int fR = fromPos[0];
        int fC = fromPos[1];
        for (int [] dir : directions) {
            while (true) {
                fR += dir[0];
                fC += dir[1];
                int[] nextPos = {fR, fC};
                if (!board.isInsideBoard(nextPos)) {
                    break;
                }
                Piece pieceAtNext = board.getPieceAt(nextPos);
                if (pieceAtNext == null) {
                    legalMoves.add(nextPos);
                } else {
                    if (pieceAtNext.color != this.color) {
                        legalMoves.add(nextPos);
                    }
                    break;
                }
            }
        }
        return legalMoves;
    }

    protected List<int []> getSteppingMoves(List<int []> directions, Board board, int[] fromPos) {
        List <int []> legalMoves = new ArrayList<>();
        int fR = fromPos[0];
        int fC = fromPos[1];
        for (int [] dir : directions) {
            int[] nextPos = {fR + dir[0], fC + dir[1]};
            if (!board.isInsideBoard(nextPos)) {
                continue;
            }
            Piece pieceAtNext = board.getPieceAt(nextPos);
            if (pieceAtNext == null || pieceAtNext.color != this.color) {
                legalMoves.add(nextPos);
            }
        }
        return legalMoves;
    }
}
