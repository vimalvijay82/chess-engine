import Piece from './Piece.js';

export default class King extends Piece {
    constructor(color) {
        super('king', color);
    }
    getPseudoValidMoves(board, fromPos){
        let offsets = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]
        return this._getSteppingMoves(offsets, board, fromPos)
    }
}