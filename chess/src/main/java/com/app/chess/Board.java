package com.app.chess;

import java.util.List;
import java.util.Arrays;
import java.util.HashMap;
import com.app.chess.Pieces.Piece;

public class Board {
    Piece[][] board;
    int[] whiteKingPos;
    int[] blackKingPos;
    List<int[]> whitePieces;
    List<int[]> blackPieces;
    HashMap<String, HashMap<String, Boolean>> castlingRights;

}
