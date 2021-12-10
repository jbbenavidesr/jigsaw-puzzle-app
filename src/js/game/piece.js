/**
 * Piece of the puzzle.
 *
 * @param {Object} props    The properties of the piece.
 */
function Piece(props) {
    const { position, tabs, isPlaced } = Object.assign(
        { isPlaced: false },
        props
    );

    this.position = position;
    this.tabs = tabs;
    this.isPlaced = isPlaced;
}

Piece.prototype.place = function () {
    this.isPlaced = true;
};

Piece.prototype.setElem = function (elem) {
    this.elem = elem;
};

export default Piece;
