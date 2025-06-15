import Piece from './Piece.js';

export default class King extends Piece {
    constructor(color) {
        super('king', color);
    }
    getPseudoLegalMoves(board, fromPos, attack=false){

        let offsets = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]
        let kingAllMoves = this._getSteppingMoves(offsets, board, fromPos);
        
        //Castling
        if (!attack) {
            const squareForCastling = {
                white: {kingside: [7,6], queenside: [7,2]},
                black: {kingside: [0,6], queenside: [0,2]}
            }
            if (board.canCastle(this.color, 'kingside')) {
                kingAllMoves.push(squareForCastling[this.color]['kingside'])
            }
            if (board.canCastle(this.color, 'queenside')) {
                kingAllMoves.push(squareForCastling[this.color]['queenside'])
            }
        }
        
        return kingAllMoves
    }

    deepCopy() {
        const copy = new King(this.color);
        copy.hasMoved = this.hasMoved;
        return copy;
    }
}