import getRandomShapes from "./helpers/getRandomShapes";
import emitEvent from "../utils/emitEvent";

import Piece from "./piece";

/**
 * The puzzle object
 */
function Puzzle(settings, initial) {
    const { numberOfPieces, imageUrl } = settings;

    this.state = initial || [];

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
        let isPlaced = this.state[index] > 0;

        return new Piece({
            position: index,
            tabs,
            isPlaced,
        });
    });
};

Puzzle.prototype.getCurrentState = function () {
    this.state = this.pieces.map((piece) => {
        return piece.isPlaced + 0;
    });
};

Puzzle.prototype.saveState = function () {
    this.getCurrentState();
    localStorage.setItem("puzzle:state", JSON.stringify(this.state));
};

export default Puzzle;
