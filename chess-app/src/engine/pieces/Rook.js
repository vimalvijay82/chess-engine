import Piece from './Piece.js';

export default class Rook extends Piece {
    constructor(color) {
        super('rook', color);
    }

    getPseudoValidMoves(board, fromPos){
        let directions = [[1,0],[-1,0],[0,1],[0,-1]]
        return this._getSlidingMoves(directions, board, fromPos)
    }
}