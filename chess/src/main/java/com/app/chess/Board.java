package com.app.chess;

import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashMap;
import com.app.chess.Pieces.*;

public class Board {
    Piece[][] board;
    int[] whiteKingPos;
    int[] blackKingPos;
    List<int[]> whitePieces;
    List<int[]> blackPieces;
    HashMap<Player, HashMap<String, Boolean>> castlingRights;
    int[] enPassantTarget;

    public Board() {
        board = initializeEmptyBoard();
        castlingRights.keySet().addAll(Arrays.asList(Player.WHITE, Player.BLACK));
        castlingRights.get(Player.WHITE).put("kingside", true);
        castlingRights.get(Player.WHITE).put("queenside", true);
        castlingRights.get(Player.BLACK).put("kingside", true);
        castlingRights.get(Player.BLACK).put("queenside", true);
        enPassantTarget = null;
    }

    public Board deepCopy() {
        Board newBoard = new Board();
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                if (this.board[i][j] != null) {
                    newBoard.board[i][j] = this.board[i][j].deepCopy();
                } else {
                    newBoard.board[i][j] = null;
                }
            }
        }
        newBoard.whiteKingPos = Arrays.copyOf(this.whiteKingPos, this.whiteKingPos.length);
        newBoard.blackKingPos = Arrays.copyOf(this.blackKingPos, this.blackKingPos.length);
        newBoard.whitePieces = new ArrayList<>();
        for (int[] pos : this.whitePieces) {
            newBoard.whitePieces.add(Arrays.copyOf(pos, pos.length));
        }
        newBoard.blackPieces = new ArrayList<>();
        for (int[] pos : this.blackPieces) {
            newBoard.blackPieces.add(Arrays.copyOf(pos, pos.length));
        }
        newBoard.castlingRights = new HashMap<>();
        for (Player player : this.castlingRights.keySet()) {
            HashMap<String, Boolean> rights = new HashMap<>(this.castlingRights.get(player));
            newBoard.castlingRights.put(player, rights);
        }
        if (this.enPassantTarget != null) {
            newBoard.enPassantTarget = Arrays.copyOf(this.enPassantTarget, this.enPassantTarget.length);
        } else {
            newBoard.enPassantTarget = null;
        }
        return newBoard;
    }

    private Piece[][] initializeEmptyBoard() {
        Piece[][] newBoard = new Piece[8][8];
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                newBoard[i][j] = null;
            }
        }
        return newBoard;
    }

    public void setNewBoard() {
        // A simple array of pieces to place
        Piece[] backRow = new Piece[]{
            new Rook(), new Knight(), new Bishop(), new Queen(),
            new King(), new Bishop(), new Knight(), new Rook()
        };

        // Simplified and more readable setup
        for (int i = 0; i < 8; i++) {
            // Pawns
            board[6][i] = new Pawn(Player.WHITE);
            board[1][i] = new Pawn(Player.BLACK);
            whitePieces.add(new int[]{6, i});
            blackPieces.add(new int[]{1, i});

            // Back Row
            board[7][i] = backRow[i].setPlayer(Player.WHITE);
            board[0][i] = backRow[i].setPlayer(Player.BLACK);
            whitePieces.add(new int[]{7, i});
            blackPieces.add(new int[]{0, i});
        }

        // Set king positions separately for clarity
        whiteKingPos = new int[]{7, 4};
        blackKingPos = new int[]{0, 4};
    }

    private String getPieceType(Piece piece) {
        if (piece instanceof King) {
            return piece.color == Player.WHITE ? "wK" : "bK";
        } else if (piece instanceof Queen) {
            return piece.color == Player.WHITE ? "wQ" : "bQ";
        } else if (piece instanceof Rook) {
            return piece.color == Player.WHITE ? "wR" : "bR";
        } else if (piece instanceof Bishop) {
            return piece.color == Player.WHITE ? "wB" : "bB";
        } else if (piece instanceof Knight) {
            return piece.color == Player.WHITE ? "wN" : "bN";
        } else if (piece instanceof Pawn) {
            return piece.color == Player.WHITE ? "wP" : "bP";
        }
    }

    public String[][] getBoard() {
        String[][] displayBoard = new String[8][8];
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                if (board[i][j] == null) {
                    displayBoard[i][j] = "";
                } else {
                    displayBoard[i][j] = getPieceType(board[i][j]);
                }
            }
        }
        return displayBoard;
    }

    public Piece getPieceAt(int[] position) {
        if (isInsideBoard(position) == false) {
            System.out.println("Position out of board bounds");
            return null;
        }
        return board[position[0]][position[1]];
    }

    public void setPieceAt(int[] position, Piece piece) {
        if (isInsideBoard(position)) {
            board[position[0]][position[1]] = piece;
        }
    }

    public boolean isInsideBoard(int[] position) {
        return position[0] >= 0 && position[0] < 8 && position[1] >= 0 && position[1] < 8;
    }

    public void movePiece(int[] fromPos, int[] toPos) {
        if (isInsideBoard(fromPos) == false || isInsideBoard(toPos) == false) {
            System.out.println("Move out of board bounds");
            return;
        }
        Piece piece = board[fromPos[0]][fromPos[1]];
        piece.hasMoved = true;
        board[toPos[0]][toPos[1]] = piece;
    }

    public List<int[]> getAllPiecesPositions(Player color) {
        return color == Player.WHITE ? whitePieces : blackPieces;
    }

    public HashMap<Piece, List<int[]>> getAllMovesColor(Player color) {
        HashMap<Piece, List<int[]>> allMoves = new HashMap<>();
        List<int[]> piecesPositions = getAllPiecesPositions(color);
        for (int[] pos : piecesPositions) {
            Piece piece = getPieceAt(pos);
            if (piece != null) {
                List<int[]> pieceMoves = piece.getPsuedoLegalMoves(this, pos);
                allMoves.put(piece, pieceMoves);
            }
        }
        return allMoves;
    }

    public boolean isCheck(List<int []> enemyPieceList, int[] kingPos) {
        for (int[] pos : enemyPieceList) {
            Piece enemyPiece = getPieceAt(pos);
            if (enemyPiece != null) {
                List<int[]> enemyMoves = enemyPiece.getPsuedoLegalMoves(this, pos, true);
                for (int[] move : enemyMoves) {
                    if (Arrays.equals(move, kingPos)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public boolean canCastle(Player color, String side) {
        HashMap<Player, HashMap<String, List<int[]>>> betweenPositions;
        betweenPositions = new HashMap<>() {{
            put(Player.WHITE, new HashMap<>() {{
                put("kingside", Arrays.asList(new int[]{7, 5}, new int[]{7, 6}));
                put("queenside", Arrays.asList(new int[]{7, 1}, new int[]{7, 2}, new int[]{7, 3}));
            }});
            put(Player.BLACK, new HashMap<>() {{
                put("kingside", Arrays.asList(new int[]{0, 5}, new int[]{0, 6}));
                put("queenside", Arrays.asList(new int[]{0, 1}, new int[]{0, 2}, new int[]{0, 3}));
            }});
        }};
        boolean rights = castlingRights.get(color).get(side);
        if (!rights) return false;

        List<int []> enemyPieceList = color == Player.WHITE ? blackPieces : whitePieces;
        int[] kingPos = color == Player.WHITE ? whiteKingPos : blackKingPos;
        if (isAttacked(enemyPieceList, kingPos)) return false;

        List<int[]> betweenPos = betweenPositions.get(color).get(side);
        for (int[] pos : betweenPos) {
            if (getPieceAt(pos) != null || isAttacked(enemyPieceList, pos)) {
                return false;
            }
        }
        return true;
    }

    public boolean isAttacked(List<int []> enemyPieceList, int[] position) {
        for (int[] pos : enemyPieceList) {
            Piece enemyPiece = getPieceAt(pos);
            if (enemyPiece != null) {
                List<int[]> enemyMoves = enemyPiece.getPsuedoLegalMoves(this, pos, true);
                for (int[] move : enemyMoves) {
                    if (Arrays.equals(move, position)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public void setNewPiece(int r, int c, String pieceType, Player color) {
        Piece newPiece = null;
        switch (pieceType) {
            case "Queen":
                newPiece = new Queen(color);
                break;
            case "Rook":
                newPiece = new Rook(color);
                break;
            case "Bishop":
                newPiece = new Bishop(color);
                break;
            case "Knight":
                newPiece = new Knight(color);
                break;
            default:
                System.out.println("Invalid piece type for promotion");
                return;
        }
        board[r][c] = newPiece;
        List<int[]> pieceList = color == Player.WHITE ? whitePieces : blackPieces;
        pieceList.add(new int[]{r, c});
    }

    public void resetBoardState() {
        enPassantTarget = null;
        castlingRights.get(Player.WHITE).put("kingside", true);
        castlingRights.get(Player.WHITE).put("queenside", true);
        castlingRights.get(Player.BLACK).put("kingside", true);
        castlingRights.get(Player.BLACK).put("queenside", true);
        whitePieces.clear();
        blackPieces.clear();
        setNewBoard();
    }

    public List<int []> getMoves(int r, int c) {
        Piece piece = getPieceAt(new int[]{r, c});
        if (piece == null) {
            return null;
        }
        return piece.getPsuedoLegalMoves(this, new int[]{r, c});
    }

    public void printBoard() {
        String[][] displayBoard = getBoard();
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                System.out.print((displayBoard[i][j].isEmpty() ? "--" : displayBoard[i][j]) + " ");
            }
            System.out.println();
        }
        System.out.println();
    }
}
