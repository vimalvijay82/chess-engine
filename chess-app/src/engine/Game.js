import Board from './board.js';

export default class Game {
    constructor() {
        this.board = new Board();
        this.currentTurn = 'white';
        this.gameOver = false;
        this.winner = null;
    }
    start(){
        this.board.setNewBoard();
        this.board.printBoard();
        return this.board.getBoard();
    }
    setPiece(r,c,type,color){
        this.board.setNewPiece(r,c,type,color)
    }
    getMoves(r,c){
        return this.board.getMoves(r,c)
    }
}