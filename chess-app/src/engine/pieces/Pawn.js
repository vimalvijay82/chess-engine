import Piece from './Piece.js';

export default class Pawn extends Piece {
    constructor(color) {
        super('pawn', color);
    }
}