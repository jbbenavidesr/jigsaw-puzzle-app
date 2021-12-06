import Puzzle from "./puzzle";
import getMask from "./helpers/getMask";

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
function drawPiece(piece, dimensions) {
    let elem = document.createElement("div");
    elem.classList.add("piece");

    let mask = getMask(piece.tabs, dimensions);

    // Set properties
    elem.style.width = dimensions.width;
    elem.style.height = dimensions.height;
    elem.style.setProperty("--piece-shape", `path("${mask}")`);

    // Background positions
    elem.style.setProperty(
        "--bg-position-y",
        `-${piece.position * dimensions.height}px`
    );
    elem.style.setProperty(
        "--bg-position-x",
        `-${piece.position * dimensions.width}px`
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
        `${pieceDimensions.height * 0.2}px`
    );
    gameContainer.style.setProperty(
        "--offset-x",
        `${pieceDimensions.width * 0.2}px`
    );

    let pieceElements = game.pieces.map((piece) =>
        drawPiece(piece, pieceDimensions)
    );

    pieceElements.forEach((elem) => {
        piecesContainer.append(elem);
    });
});

init(settings);
