export default class Piece {
    constructor(type, color) {
        this.type = type;
        this.color = color;
        this.hasMoved = false;
    }

    getPseudoLegalMoves(board, fromPos) {
        throw new Error("getPseudoLegalMoves() must be implemented in subclass");
    }

    _getSlidingMoves(directions, board, fromPos) {
        const moves = [];
        directions.forEach((dir) => {
            for(let i=1; i<8; i++) {
                let newPos = fromPos.map((value, index) => value + i * dir[index])
                if (!board.isInsideBoard(newPos)){
                    break;
                }
                let pieceAtNewPos = board.getPieceAt(newPos);
                if (pieceAtNewPos !==null && pieceAtNewPos.color === this.color) {
                    break;
                } else if (pieceAtNewPos !==null && pieceAtNewPos.color !== this.color) {
                    moves.push(newPos);
                    break;
                } else {
                    moves.push(newPos)
                }
            }   
        })
        return moves
    }

    _getSteppingMoves(offsets, board, fromPos) {
        const moves = []
        offsets.forEach((offset)=>{
            let newPos = fromPos.map((value, index) => value + offset[index]);
            if (board.isInsideBoard(newPos)){
                let pieceAtNewPos = board.getPieceAt(newPos)
                if (pieceAtNewPos === null || pieceAtNewPos.color !== this.color){
                    moves.push(newPos)
                }
            }
        })
        return moves
    }

}