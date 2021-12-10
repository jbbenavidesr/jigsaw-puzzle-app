import Puzzle from "./puzzle";
import getMask from "./helpers/getMask";
import shuffle from "../utils/shuffle";

//
// Variables
//
let game;
const settings = {
    imageUrl: "/img/skyscrappers.jpg",
    numberOfPieces: 16,
};

// elements
const gameContainer = document.querySelector("[data-app='game']");
const puzzleContainer = document.querySelector("[data-game='puzzle']");
const piecesContainer = document.querySelector("[data-game='pieces']");

// constants
const { width } = puzzleContainer.getBoundingClientRect();

//
// Methods
//
function drawPiece(piece, dimensions, piecesPerSide) {
    let elem = document.createElement("div");
    elem.classList.add("piece");

    const maskDimensions = {
        width: dimensions.width / 0.6,
        height: dimensions.height / 0.6,
    };

    const piecePosition = {
        x: piece.position % piecesPerSide,
        y: Math.floor(piece.position / piecesPerSide),
    };

    console.debug(piecePosition);

    let mask = getMask(piece.tabs, maskDimensions);

    // Set properties
    elem.style.width = dimensions.width + "px";
    elem.style.height = dimensions.height + "px";
    elem.style.setProperty("--piece-shape", `path("${mask}")`);

    // Background positions
    elem.style.setProperty(
        "--bg-position-y",
        `${(1 / 3 - piecePosition.y) * dimensions.height}px`
    );
    elem.style.setProperty(
        "--bg-position-x",
        `${(1 / 3 - piecePosition.x) * dimensions.width}px`
    );

    return elem;
}

function init(settings) {
    // Start game
    game = new Puzzle(settings);

    // Render
    gameContainer.style.setProperty(
        "--puzzle-image",
        `url("${settings.imageUrl}")`
    );
    gameContainer.style.setProperty("--pieces-per-side", game.piecesPerSide);
}

//
// Event Listeners and inits
//

document.addEventListener("puzzle:image-loaded", (event) => {
    let image = event.detail.image;

    // Set sizes
    let ratio = image.height / image.width;

    let dimensions = {
        width,
        height: width * ratio,
    };

    gameContainer.style.height = dimensions.height + "px";

    let pieceDimensions = {
        width: dimensions.width / game.piecesPerSide,
        height: dimensions.height / game.piecesPerSide,
    };

    gameContainer.style.setProperty(
        "--offset-y",
        `${pieceDimensions.height / 3}px`
    );
    gameContainer.style.setProperty(
        "--offset-x",
        `${pieceDimensions.width / 3}px`
    );

    let pieceElements = game.pieces.map((piece) =>
        drawPiece(piece, pieceDimensions, game.piecesPerSide)
    );

    shuffle(pieceElements);

    pieceElements.forEach((elem) => {
        puzzleContainer.innerHTML += `<div class="placeholder"></div>`;
        piecesContainer.append(elem);
    });
});

init(settings);
