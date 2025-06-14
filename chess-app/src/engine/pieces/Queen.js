import Piece from './Piece.js';

export default class Queen extends Piece {
    constructor(color) {
        super('queen', color);
    }
    getPseudoValidMoves(board, fromPos){
        let directions = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]
        return this._getSlidingMoves(directions, board, fromPos)
    }
}