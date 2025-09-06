package com.app.chess;

import java.util.List;

import org.apache.logging.log4j.util.Strings;

import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashMap;
import com.app.chess.Pieces.*;

public class Game {
    Board board;
    Player currentTurn;
    boolean gameOver;
    String winner;

    public Game() {
         board = new Board();
         currentTurn = Player.WHITE;
         gameOver = false;
         winner = null;
    }

    public String[][] start() {
        board.setNewBoard();
        board.printBoard();
        return  board.getBoard();
    }

    public String[][] playMove(int[] fromPos, int[] toPos) {
        // Check if source and destination are the same
        if (fromPos == toPos) {
            System.out.println("Invalid move: Source and destination are the same.");
            return board.getBoard();
        }

        // Get the piece at the source position
        Piece pieceAtFrom = board.getPieceAt(fromPos);
        
        // Check if there is a piece at the source position
        if (pieceAtFrom == null) {
            System.out.println("Invalid move: No piece at source position.");
            return board.getBoard();
        }
        
        // Check if the piece belongs to the current player
        if (pieceAtFrom.color != currentTurn) {
            System.out.println("Wrong turn: Piece does not belong to current player.");
            return board.getBoard();
        }

        // Check if the move is legal for the piece
        List<int[]> psuedoLegalMoves = pieceAtFrom.getPsuedoLegalMoves(board, fromPos);
        boolean isIncluded = false;
        for (int[] move : psuedoLegalMoves) {
            if (Arrays.equals(move, toPos)) {
                isIncluded = true;
                break;
            }
        }
        if (!isIncluded) {
            System.out.println("Invalid move: Move not allowed for this piece.");
            return board.getBoard();
        }

        // Check if the move puts own king in check
        List <int []> legalMoves = getLegalMoves(psuedoLegalMoves, fromPos);
        if (legalMoves.isEmpty()) {
            System.out.println("Invalid move: Move would put own king in check.");
            return board.getBoard();
        } else {
            boolean isLegal = false;
            for (int[] move : legalMoves) {
                if (Arrays.equals(move, toPos)) {
                    isLegal = true;
                    break;
                }
            }
            if (!isLegal) {
                System.out.println("Invalid move: Move would put own king in check.");
                return board.getBoard();
            }
        }

        // Make the move
        makeMove(board, fromPos, toPos, currentTurn);
        currentTurn = currentTurn == Player.WHITE ? Player.BLACK : Player.WHITE;

        HashMap<String, String> status = checkStatus();
        if (status != null) {
            System.out.println(status.get("status"));
            if (status.get("status").equals("checkmate")) {
                gameOver = true;
                winner = currentTurn == Player.WHITE ? "black" : "white";
            } else if (status.get("status").equals("stalemate")) {
                gameOver = true;
                winner = "draw";
            }
        }
        board.printBoard();
        return board.getBoard();
    }

    public List<int[]> getLegalMoves(List<int []> psuedoLegalMoves, int[] fromPos) {
        List<int[]> legalMoves = new ArrayList<>();
        for (int[] toPos : psuedoLegalMoves) {
            Board boardCopy = board.deepCopy();
            makeMove(boardCopy, fromPos, toPos, currentTurn);
            int[] kingPos = currentTurn == Player.WHITE ? boardCopy.whiteKingPos : boardCopy.blackKingPos;
            List<int []>enemyPieceList = currentTurn == Player.WHITE ? boardCopy.blackPieces : boardCopy.whitePieces;
            if (!boardCopy.isCheck(enemyPieceList, kingPos)) {
                legalMoves.add(toPos);
            }
        }
        return legalMoves;
    }

    public List<int []> getAllLegalMoves() {
        List<int []> allLegalMoves = new ArrayList<>();
        HashMap<int[], List<int[]>> allPseudoMoves = board.getAllMovesColor(currentTurn);
        for (int[] pos : allPseudoMoves.keySet()) {
            if (allLegalMoves.size() > 0) {
                return allLegalMoves;
            }

            List<int []> pseudoMoves = allPseudoMoves.get(pos);
            allLegalMoves.addAll((getLegalMoves(pseudoMoves, pos)));
        }
        return allLegalMoves;
    }

    public HashMap<String, String> checkStatus() {
        List <int[]> legalMoves = getAllLegalMoves();
        List <int[]> enemyPieceList = currentTurn == Player.WHITE ? board.blackPieces : board.whitePieces;
        int[] kingPos = currentTurn == Player.WHITE ? board.whiteKingPos : board.blackKingPos;
        boolean inCheck = board.isCheck(enemyPieceList, kingPos);

        if (inCheck && legalMoves.isEmpty()) {
            return new HashMap<>() {{
                put("status", "checkmate");
                put("winner", currentTurn == Player.WHITE ? "black" : "white");
            }};
        } else if (!inCheck && legalMoves.isEmpty()) {
            return new HashMap<>() {{
                put("status", "stalemate");
                put("winner", "draw");
            }};
        } else if (inCheck) {
            return new HashMap<>() {{
                put("status", "check");
                put("winner", Strings.EMPTY);
            }};
        }
        return null;
    }

    private void makeMove(Board board, int[] fromPos, int[] toPos, Player currentTurn) {
        int fR, fC, tR, tC;
        fR = fromPos[0]; fC = fromPos[1];
        tR = toPos[0]; tC = toPos[1];

        boolean isWhiteTurn = currentTurn == Player.WHITE;
        Piece pieceAtFrom = board.getPieceAt(fromPos);
        Piece pieceAtTo = board.getPieceAt(toPos);
        boolean isKingMove = pieceAtFrom.type == PieceType.KING;
        boolean isPawnMove = pieceAtFrom.type == PieceType.PAWN;
        boolean isRookMove = pieceAtFrom.type == PieceType.ROOK;
        boolean isRookCaptured = pieceAtTo != null && pieceAtTo.type == PieceType.ROOK;
        boolean inEnPassantMove = Arrays.equals(board.enPassantTarget, toPos);
        boolean isCastling = isKingMove && Math.abs(tC - fC) == 2;

        updatePiecePosition(board, fromPos, toPos, isWhiteTurn);
        updateCastlingRights(board, fromPos, toPos, currentTurn, isKingMove, isRookMove, isRookCaptured);

        pieceAtFrom.hasMoved = true;
        board.board[tR][tC] = pieceAtFrom;
        board.board[fR][fC] = null;
        
        // Handle special moves
        if (isPawnMove) {
            handlePawnMove(board, fR, fC, tR, tC, isWhiteTurn, inEnPassantMove);
        }
        if (isKingMove) {
            updateKingPosition(board, toPos, isWhiteTurn);
        }
        if (isCastling) {
            String castleSide = tC == 6 ? "kingside" : "queenside";
            updateCastlingRookPosition(board, currentTurn, castleSide);
        }
        if (!isPawnMove || Math.abs(tR - fR) != 2) {
            board.enPassantTarget = null;
        } 
    }

    private void updatePiecePosition(Board board, int[] fromPos, int[] toPos, boolean isWhiteTurn) {
        List<int[]> pieceList, opponentPieceList;
        if (isWhiteTurn) {
            pieceList = board.whitePieces;
            opponentPieceList = board.blackPieces;
        } else {
            pieceList = board.blackPieces;
            opponentPieceList = board.whitePieces;
        }

        removeValue(pieceList, fromPos);
        pieceList.add(toPos);

        Piece pieceAtTo = board.getPieceAt(toPos);
        if (pieceAtTo != null) {
            removeValue(opponentPieceList, toPos);
        }
    }

    private void updateCastlingRights(Board board, int[] fromPos, int[] toPos, Player currTurn, boolean isKingMove, 
                                     boolean isRookMove, boolean isRookCaptured) {
        
        if (isKingMove) {
            board.castlingRights.get(currTurn).put("kingside", false);
            board.castlingRights.get(currTurn).put("queenside", false);
        } else if (isRookMove) {
            if (fromPos[0] == 7 && fromPos[1] == 7 && currTurn == Player.WHITE) {
                board.castlingRights.get(currTurn).put("kingside", false);
            } else if (fromPos[0] == 7 && fromPos[1] == 0 && currTurn == Player.WHITE) {
                board.castlingRights.get(currTurn).put("queenside", false);
            } else if (fromPos[0] == 0 && fromPos[1] == 7 && currTurn == Player.BLACK) {
                board.castlingRights.get(currTurn).put("kingside", false);
            } else if (fromPos[0] == 0 && fromPos[1] == 0 && currTurn == Player.BLACK) {
                board.castlingRights.get(currTurn).put("queenside", false);
            }
        } else if (isRookCaptured) {
            if (toPos[0] == 7 && toPos[1] == 7 && currTurn == Player.BLACK) {
                board.castlingRights.get(Player.WHITE).put("kingside", false);
            } else if (toPos[0] == 7 && toPos[1] == 0 && currTurn == Player.BLACK) {
                board.castlingRights.get(Player.WHITE).put("queenside", false);
            } else if (toPos[0] == 0 && toPos[1] == 7 && currTurn == Player.WHITE) {
                board.castlingRights.get(Player.BLACK).put("kingside", false);
            } else if (toPos[0] == 0 && toPos[1] == 0 && currTurn == Player.WHITE) {
                board.castlingRights.get(Player.BLACK).put("queenside", false);
            }
        }                                
    }

    private void handlePawnMove(Board board, int fR, int fC, int tR, int tC, boolean isWhiteTurn, boolean inEnPassantMove) {
        if (inEnPassantMove) {
            int direction = isWhiteTurn ? 1 : -1;
            int [] capturedPawnPos = {tR + direction, tC};
            List<int []> opponentPieceList = isWhiteTurn ? board.blackPieces : board.whitePieces;

            removeValue(opponentPieceList, capturedPawnPos);
            board.board[tR + direction][tC] = null;
        } else if (Math.abs(tR - fR) == 2) {
            board.enPassantTarget = isWhiteTurn ? new int[]{tR + 1, tC} : new int[]{tR - 1, tC};
        } else if (tR == 0 || tR == 7) {
            board.setNewPiece(tR, tC, "Queen", isWhiteTurn ? Player.WHITE : Player.BLACK);
        }
    }

    private void updateKingPosition(Board board, int[] toPos, boolean isWhiteTurn) {
        if (isWhiteTurn) {
            board.whiteKingPos = toPos;
        } else {
            board.blackKingPos = toPos;
        }
    }

    private void updateCastlingRookPosition(Board board, Player currTurn, String castleSide) {
        HashMap<Player, HashMap<String, int[]>> rookInitialPositions = new HashMap<>() {{
            put(Player.WHITE, new HashMap<>() {{
                put("kingside", new int[]{7, 7});
                put("queenside", new int[]{7, 0});
            }});
            put(Player.BLACK, new HashMap<>() {{
                put("kingside", new int[]{0, 7});
                put("queenside", new int[]{0, 0});
            }});
        }};

        HashMap<Player, HashMap<String, int[]>> rookFinalPositions = new HashMap<>() {{
            put(Player.WHITE, new HashMap<>() {{
                put("kingside", new int[]{7, 5});
                put("queenside", new int[]{7, 3});
            }});
            put(Player.BLACK, new HashMap<>() {{
                put("kingside", new int[]{0, 5});
                put("queenside", new int[]{0, 3});
            }});
        }};

        int[] rookFromPos = rookInitialPositions.get(currTurn).get(castleSide);
        int[] rookToPos = rookFinalPositions.get(currTurn).get(castleSide);
        Piece rook = board.getPieceAt(rookFromPos);
        rook.hasMoved = true;
        board.board[rookToPos[0]][rookToPos[1]] = rook;
        board.board[rookFromPos[0]][rookFromPos[1]] = null;
        updatePiecePosition(board, rookFromPos, rookToPos, currTurn == Player.WHITE);
    }

    private void removeValue(List<int[]> list, int[] value) {
        list.removeIf(pos -> Arrays.equals(pos, value));
    }

    public List<int[]> getMoves(int r, int c){
        return board.getMoves(r, c);
    }

}
