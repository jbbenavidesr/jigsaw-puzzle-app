import getRandomShapes from "./helpers/getRandomShapes";
import emitEvent from "../utils/emitEvent";

import Piece from "./piece";

/**
 * The puzzle object
 */
function Puzzle(settings) {
    const { numberOfPieces, imageUrl } = settings;

    // Check if previous game stored
    let initial = localStorage.getItem("puzzle:history");
    if (initial) {
        initial = JSON.parse(initial);
    }

    this.history = initial || [];

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
    this.history.forEach((position) => {
        this.pieces[position].place();
    });
};

Puzzle.prototype.getCurrentState = function () {
    return this.pieces.map((piece) => {
        return piece.isPlaced + 0;
    });
};

Puzzle.prototype.saveHistory = function () {
    localStorage.setItem("puzzle:history", JSON.stringify(this.history));
};

Puzzle.prototype.placePiece = function (position) {
    this.history.push(position);
    this.pieces.find((piece) => piece.position === position).place();
    this.saveHistory();
};

export default Puzzle;
