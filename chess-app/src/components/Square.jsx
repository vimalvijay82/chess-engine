import { useDroppable } from '@dnd-kit/core';
import Piece from './Piece';

const Square = ({ id, piece }) => {
    const { setNodeRef } = useDroppable({ id });

    // Determine square color (light or dark)
    const squareColor = (id) => {
        const [row, col] = id.split('-').map(Number);
        return (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863'; // Light and dark squares
    };

    return (
        <div
            ref={setNodeRef}
            style={{
                backgroundColor: squareColor(id),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {piece && <Piece id={id} type={piece} />}
        </div>
    );
};

export default Square;