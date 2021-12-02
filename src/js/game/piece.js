import getMask from "./helpers/getMask";

/**
 * Piece of the puzzle.
 *
 * @param {Object} props    The properties of the piece.
 */
function Piece(props) {
    const { position, tabs, dimensions } = props;

    this.position = position;
    this.shape = getMask(tabs, dimensions);
    this.isPlaced = false;
}

Piece.prototype.place = function () {
    this.isPlaced = true;
};

export default Piece;
