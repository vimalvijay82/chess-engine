import Pawn from './pieces/Pawn.js';
import Rook from './pieces/Rook.js';
import Knight from './pieces/Knight.js';
import Bishop from './pieces/Bishop.js';
import Queen from './pieces/Queen.js';
import King from './pieces/King.js'


export default class ChessBoard {
    constructor() {
        this.board = this._initializeEmptyBoard();
        this.whiteKingPos = [];
        this.blackKingPos = [];
        this.whitePieces = [];
        this.blackPieces = [];
        this.castlingRights = {
            white: {kingside: true, queenside: true},
            black: {kingside: true, queenside: true}
        }
        this.enPassantTarget = null;
    }

    deepCopy() {
        const copy = new ChessBoard();
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                if (this.board[i][j] != null) {
                    copy.board[i][j] = this.board[i][j].deepCopy();
                }
            }
        }
        copy.whiteKingPos = this.whiteKingPos.slice();
        copy.blackKingPos = this.blackKingPos.slice();
        if (this.enPassantTarget != null) {
            copy.enPassantTarget = this.enPassantTarget.slice();
        } else {
            copy.enPassantTarget = this.enPassantTarget
        }
    
        copy.whitePieces = this.whitePieces.map(coord => coord.slice());
        copy.blackPieces = this.blackPieces.map(coord => coord.slice());

        copy.castlingRights = JSON.parse(JSON.stringify(this.castlingRights));
        
        return copy;
    }

    _initializeEmptyBoard(){
        let board = [];
        for (let i = 0; i < 8; i++) {
            let row = [];
            for (let j = 0; j < 8; j++) {
                row.push(null);
            }
            board.push(row);
        }
        return board;
    }

    setNewBoard(){
        for (let i = 0; i < 8; i++) {
            this.board[6][i] = new Pawn('white');
            this.board[1][i] = new Pawn('black');
            this.whitePieces.push([6,i]);
            this.blackPieces.push([1,i]);
        }
        let i = 0;
        let j = 7;
        while (i < j) {
            if (i === j-1) {
                this.board[7][i] = new Queen('white');
                this.board[7][j] = new King('white');
                this.board[0][i] = new Queen('black');
                this.board[0][j] = new King('black');
                this.whiteKingPos = [7,j];
                this.blackKingPos = [0,j];
            }
            else {
                switch (i) {
                    case 0:
                        this.board[7][i] = new Rook('white');
                        this.board[7][j] = new Rook('white');
                        this.board[0][i] = new Rook('black');
                        this.board[0][j] = new Rook('black');
                        break;
                    case 1:
                        this.board[7][i] = new Knight('white');
                        this.board[7][j] = new Knight('white');
                        this.board[0][i] = new Knight('black');
                        this.board[0][j] = new Knight('black');
                        break;
                    case 2:
                        this.board[7][i] = new Bishop('white');
                        this.board[7][j] = new Bishop('white');
                        this.board[0][i] = new Bishop('black');
                        this.board[0][j] = new Bishop('black');
                        break;
                }
            }
            this.whitePieces.push([7,i]);
            this.whitePieces.push([7,j]);
            this.blackPieces.push([0,i]);
            this.blackPieces.push([0,j]);
            i++;
            j--;
        }
        return this.board;
    }

    _getPieceType(piece) {
        if (piece instanceof Pawn && piece.color === 'white') return 'wP';
        if (piece instanceof Pawn && piece.color === 'black') return 'bP';
        if (piece instanceof Rook && piece.color === 'white') return 'wR';
        if (piece instanceof Rook && piece.color === 'black') return 'bR';
        if (piece instanceof Knight && piece.color === 'white') return 'wN';
        if (piece instanceof Knight && piece.color === 'black') return 'bN';
        if (piece instanceof Bishop && piece.color === 'white') return 'wB';
        if (piece instanceof Bishop && piece.color === 'black') return 'bB';
        if (piece instanceof Queen && piece.color === 'white') return 'wQ';
        if (piece instanceof Queen && piece.color === 'black') return 'bQ';
        if (piece instanceof King && piece.color === 'white') return 'wK';
        if (piece instanceof King && piece.color === 'black') return 'bK';
        return null;
    }

    getBoard() {
        let board = [];
        for (let i = 0; i < 8; i++) {
            let row = [];
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j] === null) {
                    row.push('');
                } else {
                    row.push(this._getPieceType(this.board[i][j]));
                }
            }
            board.push(row);
        }
        return board;
    }

    getPieceAt(position) {
        const [row, col] = position;
        if (this.isInsideBoard(position) === false) {
            throw new Error('Position out of bounds');
        }
        return this.board[row][col];
    }

    setPieceAt(position, piece) {
        const [row, col] = position;
        if (this.isInsideBoard(position) === false) {
            throw new Error('Position out of bounds');
        }
        this.board[row][col] = piece;
    }

    isInsideBoard(position) {
        const [row, col] = position;
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    movePiece(fromPos, toPos) {
        if (!this.isInsideBoard(fromPos) || !this.isInsideBoard(toPos)) {
            throw new Error('Position out of bounds')
        }
        let [fR, fC] = fromPos
        let [tR, tC] = toPos
        let piece = this.board[fR][fC]
        piece.hasMoved = true
        this.board[tR][tC] = piece
    }

    getAllPiecesColor(color){
        switch(color){
            case 'white':
                return this.whitePieces;
            case 'black':
                return this.blackPieces;
        }
    }

    getAllMovesColor(color){
        let moves = {};
        let pieceList = [];
        if(color === 'white'){
            pieceList = this.whitePieces;
        } else {
            pieceList = this.blackPieces;
        }
        pieceList.forEach((piece)=>{
            const currPiece = this.getPieceAt(piece);
            moves[piece] = currPiece.getPseudoLegalMoves(this, piece)
            // moves.push(currPiece.getPseudoLegalMoves())
        })
        return moves
    }

    isCheck(enemyPieceList, kingPos) {

        for(let i=0; i<enemyPieceList.length; i++) {
            const pos = enemyPieceList[i];
            const currPiece = this.getPieceAt(pos);
            const pseudoLegalMoves = currPiece.getPseudoLegalMoves(this, pos, true)
            const isKingIncluded = pseudoLegalMoves.some(arr => JSON.stringify(arr) === JSON.stringify(kingPos));

            if (isKingIncluded) {
                return true;
            }
        }
        return false;
    }

    canCastle(color, side) {
        const betweenPositions = {
            white: {kingside: [[7,5], [7,6]], queenside: [[7,1], [7,2], [7, 3]]},
            black: {kingside: [[0,5], [0,6]], queenside: [[0,1], [0,2], [0, 3]]},
        }
        const castlingRight = this.castlingRights[color][side];
        if (!castlingRight) {
            return false;
        }

        const enemyPieceList = color === 'white' ? this.blackPieces : this.whitePieces;
        let kingPos = color === 'white' ? this.whiteKingPos : this.blackKingPos;
        if (this.isAttacked(enemyPieceList, kingPos)) {
            return false;
        }

        const bwPos = betweenPositions[color][side]
        for (let i=0; i < bwPos.length; i++) {
            if (this.getPieceAt(bwPos[i]) !== null) {
                return false;
            }
        }

        for (let i=0; i<2; i++) {
            if (this.isAttacked(enemyPieceList, bwPos[i])) {
                return false;
            }
        }

        return true;
    }

    isAttacked(enemyPieceList, kingPos) {

        for(let i=0; i<enemyPieceList.length; i++) {
            const pos = enemyPieceList[i];
            const currPiece = this.getPieceAt(pos);
            const pseudoLegalMoves = currPiece.getPseudoLegalMoves(this, pos, true)
            const isKingIncluded = pseudoLegalMoves.some(arr => JSON.stringify(arr) === JSON.stringify(kingPos));

            if (isKingIncluded) {
                return true;
            }
        }
        return false;
    }

    // ----------------------------------ADDITIONAL FNS------------------------------------//
    setNewPiece(row, col, type, color) {
        console.log(`Setting new piece: ${type} at (${row}, ${col}) with color ${color}`);
        switch(type){
            case 'Rook':
                this.board[row][col] = new Rook(color)
                break;
            case 'King':
                this.board[row][col] = new King(color)
                break;
            case 'Queen':
                this.board[row][col] = new Queen(color)
                break;
            case 'Bishop':
                this.board[row][col] = new Bishop(color)
                break;
            case 'Knight':
                this.board[row][col] = new Knight(color)
                break;
            case 'Pawn':
                this.board[row][col] = new Pawn(color)
                break;
            default:
                throw new Error('Invalid piece type');
        }
    }
    
    resetBoard() {
        this.board = this.createBoard();
    }

    getMoves(r,c){
        return this.board[r][c].getPseudoLegalMoves(this, [r,c])
    }

    printBoard() {
        for (let i = 0; i < 8; i++) {
            let row = '';
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === null) {
                    row += ' . ';
                } else {
                    if (this.board[i][j].color === 'white'){
                        row += ` ${this.board[i][j].type[0].toUpperCase()} `;
                    } else {
                        row += ` ${this.board[i][j].type[0]} `;
                    }
                }
            }
            console.log(row);
        }
    }
}
