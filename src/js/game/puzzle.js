import {
    getRandomShapes
} from "../utils";
import Piece from "./piece";

/**
 * The puzzle object
 */
function Puzzle(props) {
    const {
        numberOfPieces,
        image
    } = props;

    this._piecesPerSide = Math.round(Math.sqrt(numberOfPieces));
    this._pieces = [];
    this.createPieces();

}

Puzzle.prototype.createPieces = function () {
    let shapes = getRandomShapes(this._piecesPerSide);
    this._pieces = shapes.map((tabs, index) => {
        return new Piece({
            position: index,
            tabs,
            dimensions: {
                width: 100,
                height: 100,
            },
        })
    })
}

Puzzle.prototype.getCurrentState = function () {
    return this._pieces.map((piece) => {
        return piece.isPlaced + 0;
    })
}

export default Puzzle;