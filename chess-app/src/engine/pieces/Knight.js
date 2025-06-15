import Piece from './Piece.js';

export default class Knight extends Piece {
    constructor(color) {
        super('knight', color);
    }
    getPseudoLegalMoves(board, fromPos){
        let offsets = [[2,1],[2,-1],[1,2],[-1,2],[-2,1],[-2,-1],[1,-2],[-1,-2]];
        return this._getSteppingMoves(offsets, board, fromPos);
    }

    deepCopy() {
        const copy = new Knight(this.color);
        copy.hasMoved = this.hasMoved;
        return copy;
    }
}