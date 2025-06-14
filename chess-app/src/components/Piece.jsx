import { useDraggable } from '@dnd-kit/core';
import wP from '../assets/pieces/wP.png';
import wN from '../assets/pieces/wN.png';
import wB from '../assets/pieces/wB.png';
import wR from '../assets/pieces/wR.png';
import wQ from '../assets/pieces/wQ.png';
import wK from '../assets/pieces/wK.png';
import bP from '../assets/pieces/bP.png';
import bN from '../assets/pieces/bN.png';
import bB from '../assets/pieces/bB.png';
import bR from '../assets/pieces/bR.png';
import bQ from '../assets/pieces/bQ.png';
import bK from '../assets/pieces/bK.png';

// Map piece types to their corresponding PNG images
const pieceImages = {
  'wP': wP, // White pawn
  'wN': wN, // White knight
  'wB': wB, // White bishop
  'wR': wR, // White rook
  'wQ': wQ, // White queen
  'wK': wK, // White king
  'bP': bP, // Black pawn
  'bN': bN, // Black knight
  'bB': bB, // Black bishop
  'bR': bR, // Black rook
  'bQ': bQ, // Black queen
  'bK': bK, // Black king
};

const Piece = ({ id, type }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        cursor: 'grab',
        width: '100%',
        height: '100%',
    };

    return (
        <img
            ref={setNodeRef}
            src={pieceImages[type]}
            alt={type}
            style={style}
            {...listeners}
            {...attributes}
        />
    );
};

export default Piece;