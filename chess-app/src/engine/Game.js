import Board from './Board.js';

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

    playMove(fromPos, toPos) {
        if (fromPos === toPos) {
            return this.board.getBoard();
        }
        const pieceAtFrom = this.board.getPieceAt(fromPos)
        if(pieceAtFrom === null){
            throw new Error('No piece at from position');
        }

        if(pieceAtFrom.color !== this.currentTurn){
            throw new Error('Wrong turn');
        }
        const pseudoLegalMoves = pieceAtFrom.getPseudoLegalMoves(this.board, fromPos)
        const isIncluded = pseudoLegalMoves.some(arr => JSON.stringify(arr) === JSON.stringify(toPos));
        if(!isIncluded){
            throw new Error('Not a legal move');
        }

        const legalMoves = this.getLegalMoves(pseudoLegalMoves, fromPos);
        const includedLegalMoves = legalMoves.some(arr => JSON.stringify(arr) === JSON.stringify(toPos));
        if (!includedLegalMoves) {
            throw new Error('Not a legal move');
        }

        // move the piece
        this._makeMove(this.board, fromPos, this.currentTurn, toPos);
        this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
        
        const status = this.checkStatus();
        if (status) {
            console.log(status.status);
            if (status.status === 'checkmate') {
                console.log(`Checkmate! ${status.winner} wins!`);
            } else if (status.status === 'stalemate') {
                console.log('Stalemate! The game is a draw.');
            }
        }
        this.board.printBoard();
        return this.board.getBoard();
    }

    getLegalMoves(pseudoLegalMoves, fromPos) {
        const legalMoves = []
        pseudoLegalMoves.forEach((move)=>{
            const cloneBoard = this.board.deepCopy();
            this._makeMove(cloneBoard, fromPos, this.currentTurn, move);
            
            const isWhite = this.currentTurn === 'white';
            const enemyPieceList = isWhite ? cloneBoard.blackPieces : cloneBoard.whitePieces;
            const kingPos = isWhite ? cloneBoard.whiteKingPos : cloneBoard.blackKingPos;
            const check = cloneBoard.isCheck(enemyPieceList, kingPos)
            // const check = false
            if (!check) {
                legalMoves.push(move);
            }
        })

        return legalMoves;
    }

    getAllLegalMoves() {
        const legalMoves = []
        const allPseudoMoves = this.board.getAllMovesColor(this.currentTurn);
        for (const key of Object.keys(allPseudoMoves)) {
            if (legalMoves.length > 0) {
                return legalMoves;
            }

            let pseudoLegalMoves = allPseudoMoves[key]
            let fromPos = key.split(',').map(Number);

            legalMoves.push(...this.getLegalMoves(pseudoLegalMoves, fromPos))
        }
        return legalMoves;

    }

    isCheckmate() {
        const legalMoves = this.getAllLegalMoves();
        const enemyPieceList = this.currentTurn === 'white' ? this.board.blackPieces : this.board.whitePieces;
        const kingPos = this.currentTurn === 'white' ? this.board.whiteKingPos : this.board.blackKingPos;
        const check = this.board.isCheck(enemyPieceList, kingPos);

        return check && legalMoves.length === 0;
    }

    isStalemate() {
        const legalMoves = this.getAllLegalMoves();
        return legalMoves.length === 0;
    }

    checkStatus() {
        const legalMoves = this.getAllLegalMoves();
        const enemyPieceList = this.currentTurn === 'white' ? this.board.blackPieces : this.board.whitePieces;
        const kingPos = this.currentTurn === 'white' ? this.board.whiteKingPos : this.board.blackKingPos;
        const check = this.board.isCheck(enemyPieceList, kingPos);

        if( check && legalMoves.length === 0) {
            // this.gameOver = true;
            return { status: 'checkmate', winner: this.currentTurn === 'white' ? 'black' : 'white' };
        }
        if (legalMoves.length === 0) {
            // this.gameOver = true;
            return { status: 'stalemate', winner: null };
        }
        if (check) {
            return { status: 'check', winner: null };
        }
    }

    _makeMove(board, fromPos, currTurn, toPos) {
        const [fR, fC] = fromPos;
        const [tR, tC] = toPos;
        const isWhiteTurn = currTurn === 'white';
        const pieceAtFrom = board.getPieceAt(fromPos);
        const pieceAtTo = board.getPieceAt(toPos);
        const isKingMove = pieceAtFrom.type === 'king';
        const isPawnMove = pieceAtFrom.type === 'pawn';
        const isRookMove = pieceAtFrom.type === 'rook';
        const isRookCaptured = pieceAtTo !== null && pieceAtTo.type === 'rook';
        const isEnPassantMove = JSON.stringify(board.enPassantTarget) === JSON.stringify(toPos);
        const isCastling = isKingMove && (Math.abs(fC - tC) === 2)

        this._updatePiecePosition(board, fromPos, toPos, isWhiteTurn);
        this._updateCastlingRights(board, fromPos, toPos, currTurn, isKingMove, isRookMove, isRookCaptured);
        
        pieceAtFrom.hasMoved = true;
        board.board[tR][tC] = pieceAtFrom;
        board.board[fR][fC] = null;
        
        if (isPawnMove) {
            this._handlePawnMove(board, fR, tR, tC, isWhiteTurn, isEnPassantMove);
        }

        if (isKingMove) {
            this._updateKingPosition(board, toPos, isWhiteTurn);
        }

        if (isCastling) {
            const castleSide = tC > fC ? 'kingside' : 'queenside';
            this._updateCastlingRookPosition(board, currTurn, castleSide);
        }

        if (!isPawnMove || Math.abs(fR - tR) !== 2){
            board.enPassantTarget = null;
        }
        
    }

    _updatePiecePosition(board, fromPos, toPos, isWhiteTurn) {
        const pieceList = isWhiteTurn ? board.whitePieces : board.blackPieces;
        const opponentPieces = isWhiteTurn ? board.blackPieces : board.whitePieces;

        this._removeValue(pieceList, fromPos);
        pieceList.push(toPos);

        const pieceAtTo = board.getPieceAt(toPos);
        if (pieceAtTo) {
            this._removeValue(opponentPieces, toPos);
        }
    }

    _updateCastlingRights(board, fromPos, toPos, currTurn, isKingMove, isRookMove, isRookCaptured) {
        if (isKingMove) {
            board.castlingRights[currTurn].kingside = false;
            board.castlingRights[currTurn].queenside = false;
        } else if (isRookMove) {
            if (fromPos[0] === 7 && fromPos[1] === 7 && currTurn === 'white') {
                board.castlingRights[currTurn].kingside = false;
            } else if (fromPos[0] === 7 && fromPos[1] === 0 && currTurn === 'white') {
                board.castlingRights[currTurn].quuenside = false;
            } else if (fromPos[0] === 0 && fromPos[1] === 7 && currTurn === 'black') {
                board.castlingRights[currTurn].kingside = false;
            } else if (fromPos[0] === 0 && fromPos[1] === 0 && currTurn === 'black') {
                board.castlingRights[currTurn].queenside = false;
            }
        } else if (isRookCaptured) {
            if (toPos[0] === 7 && toPos[1] === 7 && currTurn === 'black') {
                board.castlingRights['white'].kingside = false;
            } else if (toPos[0] === 7 && toPos[1] === 0 && currTurn === 'black') {
                board.castlingRights['whtie'].quuenside = false;
            } else if (toPos[0] === 0 && toPos[1] === 7 && currTurn === 'white') {
                board.castlingRights['black'].kingside = false;
            } else if (toPos[0] === 0 && toPos[1] === 0 && currTurn === 'white') {
                board.castlingRights['black'].queenside = false;
            }
        }
    }

    _updateCastlingRookPosition(board, currTurn, castleSide) {
        const rookInitialPositions = {
            white: {kingside: [7, 7], queenside: [7, 0]},
            black: {kingside: [0, 7], queenside: [0, 0]}
        }
        const rookFinalPositions = {
            white: {kingside: [7, 5], queenside: [7, 3]},
            black: {kingside: [0, 5], queenside: [0, 3]}
        }
        const [fR, fC] = rookInitialPositions[currTurn][castleSide];
        const [tR, tC] = rookFinalPositions[currTurn][castleSide];
        const rookAtIP = board.getPieceAt([fR, fC])
        rookAtIP.hasMoved = true;
        board.board[tR][tC] = rookAtIP;
        board.board[fR][fC] = null; 
        this._updatePiecePosition(board, [fR, fC], [tR, tC], currTurn === 'white');
    }

    _handlePawnMove(board, fR, tR, tC, isWhiteTurn, isEnPassantMove) {
        if (isEnPassantMove) {
            const capturedPawnPos = isWhiteTurn ? [tR + 1, tC] : [tR - 1, tC];
            const opponentPieces = isWhiteTurn ? board.blackPieces : board.whitePieces;

            this._removeValue(opponentPieces, capturedPawnPos);
            board.board[capturedPawnPos[0]][capturedPawnPos[1]] = null;
        } else if (Math.abs(fR - tR) === 2) {
            board.enPassantTarget = isWhiteTurn ? [tR + 1, tC] : [tR - 1, tC];
        } else if (tR === 0 || tR === 7) {
            const promotedPiece =  'Queen'; // You can change this to any piece type
            board.setNewPiece(tR, tC, promotedPiece, isWhiteTurn ? 'white' : 'black');
        }
    }

    _updateKingPosition(board, toPos, isWhiteTurn) {
        if (isWhiteTurn) {
            board.whiteKingPos = toPos;
        } else {
            board.blackKingPos = toPos;
        }
    }

    _removeValue(array, value){
        const index = array.findIndex(arr => 
            arr.length === value.length && arr.every((val, i) => val === value[i])
        );
        if (index > -1) {
            array.splice(index, 1)
        }
        return array
    }

    getMoves(r,c){
        return this.board.getMoves(r,c)
    }
}