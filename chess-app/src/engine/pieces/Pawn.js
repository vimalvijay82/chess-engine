import Piece from './Piece.js';

export default class Pawn extends Piece {
    constructor(color) {
        super('pawn', color);
    }

    getPseudoLegalMoves(board, fromPos, attack=false){
        let moves = [];
        const movementDir = this.color === 'white' ? -1 : 1;
        const offsets = this.hasMoved ? [[1, 0]] : [[1, 0], [2, 0]];

        if (!attack) {
            offsets.forEach((offset)=>{
                let newPos = fromPos.map((value, index) => value + (offset[index] * movementDir));
                if (board.isInsideBoard(newPos)){
                    let pieceAtNewPos = board.getPieceAt(newPos);
                    if (pieceAtNewPos === null){
                        moves.push(newPos);
                    }
                }
            })
        }

        const captureOffsets = [[1, -1], [1, 1]];
        captureOffsets.forEach((offset)=>{
            let newPos = fromPos.map((value, index) => value + (offset[index] * movementDir));
            if (board.isInsideBoard(newPos)){
                let pieceAtNewPos = board.getPieceAt(newPos);
                if ((pieceAtNewPos !== null && pieceAtNewPos.color !== this.color) 
                    || JSON.stringify(board.enPassantTarget) === JSON.stringify(newPos)) {
                    moves.push(newPos);
                }
            }
        })
        return moves;
    }

    deepCopy() {
        const copy = new Pawn(this.color);
        copy.hasMoved = this.hasMoved;
        return copy;
    }
}