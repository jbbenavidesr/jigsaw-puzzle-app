import getRandomShapes from "./helpers/getRandomShapes";
import emitEvent from "../utils/emitEvent";

import Piece from "./piece";

/**
 * The puzzle object
 */
function Puzzle(props) {
    const { numberOfPieces, imageUrl } = props;

    this.piecesPerSide = Math.round(Math.sqrt(numberOfPieces));
    this.pieces = [];
    this.image = new Image();
    this.image.onload = function (e) {
        emitEvent("puzzle:image-loaded", {
            image: e.target,
        });
    };
    this.image.src = imageUrl;
    this.createPieces();
}

Puzzle.prototype.createPieces = function () {
    let shapes = getRandomShapes(this.piecesPerSide);
    this.pieces = shapes.map((tabs, index) => {
        return new Piece({
            position: index,
            tabs,
        });
    });
};

Puzzle.prototype.getCurrentState = function () {
    return this.pieces.map((piece) => {
        return piece.isPlaced + 0;
    });
};

export default Puzzle;
