import Piece from './Piece.js';

export default class Bishop extends Piece {
    constructor(color) {
        super('bishop', color);
    }
    getPseudoLegalMoves(board, fromPos){
        let directions = [[1,1],[-1,1],[1,-1],[-1,-1]]
        return this._getSlidingMoves(directions, board, fromPos)
    }

    deepCopy() {
        const copy = new Bishop(this.color);
        copy.hasMoved = this.hasMoved;
        return copy;
    }
}