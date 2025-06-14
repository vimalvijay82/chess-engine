import Pawn from './pieces/Pawn.js';
import Rook from './pieces/Rook.js';
import Knight from './pieces/Knight.js';
import Bishop from './pieces/Bishop.js';
import Queen from './pieces/Queen.js';
import King from './pieces/King.js'


export default class ChessBoard {
    constructor() {
        this.board = this._initializeEmptyBoard();
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
            this.board[1][i] = new Pawn('white');
            this.board[6][i] = new Pawn('black');
        }
        let i = 0;
        let j = 7;
        while (i < j) {
            if (i === j-1) {
                this.board[0][i] = new Queen('white');
                this.board[0][j] = new King('white');
                this.board[7][i] = new Queen('black');
                this.board[7][j] = new King('black');
            }
            else {
                switch (i) {
                    case 0:
                        this.board[0][i] = new Rook('white');
                        this.board[0][j] = new Rook('white');
                        this.board[7][i] = new Rook('black');
                        this.board[7][j] = new Rook('black');
                        break;
                    case 1:
                        this.board[0][i] = new Knight('white');
                        this.board[0][j] = new Knight('white');
                        this.board[7][i] = new Knight('black');
                        this.board[7][j] = new Knight('black');
                        break;
                    case 2:
                        this.board[0][i] = new Bishop('white');
                        this.board[0][j] = new Bishop('white');
                        this.board[7][i] = new Bishop('black');
                        this.board[7][j] = new Bishop('black');
                        break;
                }
            }
            i++;
            j--;
        }
        return this.board;
    }

    getBoard() {
        return this.board;
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

    // ----------------------------------ADDITIONAL FNS------------------------------------//
    setNewPiece(row, col, type, color) {
        switch(type){
            case 'Rook':
                this.board[row][col] = new Rook(color)
            case 'King':
                this.board[row][col] = new King(color)
        }
    }
    
    resetBoard() {
        this.board = this.createBoard();
    }

    getMoves(r,c){
        return this.board[r][c].getPseudoValidMoves(this, [r,c])
    }

    printBoard() {
        for (let i = 7; i >= 0; i--) {
            let row = '';
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === null) {
                    row += ' . ';
                } else {
                    row += ` ${this.board[i][j].type[0]} `;
                }
            }
            console.log(row);
        }
    }
}
