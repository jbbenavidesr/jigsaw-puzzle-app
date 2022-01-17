import Puzzle from "./puzzle";
import getMask from "./helpers/getMask";
import shuffle from "../utils/shuffle";

//
// Variables
//
let game;
let settings;

// elements
const gameContainer = document.querySelector("[data-app='game']");
const puzzleContainer = document.querySelector("[data-game='puzzle']");
const piecesContainer = document.querySelector("[data-game='pieces']");

// constants
const { width } = puzzleContainer?.getBoundingClientRect();

//
// Methods
//

function getSettings() {
    let savedSettings = localStorage.getItem("puzzle:settings");

    if (savedSettings) {
        return JSON.parse(savedSettings);
    }

    let params = new URLSearchParams(window.location.search);

    let settings = {
        numberOfPieces: +params.get("numberOfPieces"),
        imageUrl: params.get("imageUrl") + `?q=75&w=${Math.round(width)}`,
    };

    localStorage.setItem("puzzle:settings", JSON.stringify(settings));

    return settings;
}

/**
 * Given a piece object, create the element that will represent it in the DOM
 *
 * @param {Piece} piece piece object
 * @param {Object} dimensions Width and height in pixels of the piece
 * @param {Number} piecesPerSide Number of pieces per side
 * @returns
 */
function drawPiece(piece, dimensions, piecesPerSide) {
    let elem = document.createElement("div");
    elem.classList.add("piece");
    elem.id = piece.position;

    const maskDimensions = {
        width: dimensions.width / 0.6,
        height: dimensions.height / 0.6,
    };

    const piecePosition = {
        x: piece.position % piecesPerSide,
        y: Math.floor(piece.position / piecesPerSide),
    };

    let mask = getMask(piece.tabs, maskDimensions);

    // Set properties
    elem.style.width = dimensions.width + "px";
    elem.style.height = dimensions.height + "px";
    elem.style.setProperty("--piece-shape", `path("${mask}")`);

    elem.draggable = true;

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

/**
 * Start the game
 *
 * @param {Object} settings settings for the puzzle: Image and number of pieces.
 */
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

/**
 * Handles what happens when the puzzle is complete.
 * Renders a message, deletes local storage history and sends the sequence to
 * the server which is what I will use for my investigation.
 *
 */
function handleWin() {
    gameContainer.innerHTML = `
        <div class="win">
            <h2>Completed... You won!</h2>
            <a class="btn" href="/">Play Again</a>
            <img src="${settings.imageUrl}" alt="Image of the puzzle that was completed" width="${width}" >
        </div>
    `;

    localStorage.removeItem("puzzle:history");
    localStorage.removeItem("puzzle:settings");

    fetch("/.netlify/functions/connectionFauna", {
        method: "POST",
        body: JSON.stringify({
            settings,
            history: game.history,
        }),
        headers: {
            "Content-type": "application/json",
        },
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw response;
        })
        .then(function (data) {
            console.log(data);
        })
        .catch(function (error) {
            console.warn(error);
        });
}

//
// Event Listeners and inits
//

/**
 * I need to be sure that the image is loaded for rendering dimensions and initializing
 * the visual part.
 */
document.addEventListener("puzzle:image-loaded", (event) => {
    let image = event.detail.image;

    let dimensions = {
        width: image.width,
        height: image.height,
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

    pieceElements.forEach((elem, i) => {
        let placeholder = document.createElement("div");
        placeholder.classList.add("placeholder");
        placeholder.setAttribute("data-id", i);

        let id = parseInt(elem.id);

        let pieceContainer = document.createElement("div");
        pieceContainer.classList.add("placeholder");

        if (!game.pieces[id].isPlaced) {
            pieceContainer.append(elem);
        }

        piecesContainer.append(pieceContainer);
        puzzleContainer.append(placeholder);
    });

    game.pieces.forEach((piece) => {
        let id = parseInt(piece.position);
        if (piece.isPlaced) {
            let placeholder = document.querySelector(`[data-id="${id}"]`);
            let pieceElement = pieceElements.find(
                (el) => parseInt(el.id) === id
            );
            placeholder.append(pieceElement);
        }
    });
});

/**
 * All events related to Drag n Drop.
 */

// Store the piece id being dragged.
document.addEventListener("dragstart", function (event) {
    if (!event.target.matches(".piece")) return;
    event.dataTransfer.setData("id", event.target.id);
});

// Show that it is hovering over a possible drop position.
document.addEventListener("dragover", function (event) {
    event.preventDefault();
    if (!event.target.matches(".placeholder")) return;
    event.target.classList.add("hover");
});

// Remove the style cause its not hovering anymore.
document.addEventListener("dragleave", function (event) {
    event.target.classList.remove("hover");
});

// Check if it was dropped in the correct place and if so, if the puzzle is complete.
document.addEventListener("drop", function (event) {
    if (!event.target.matches(".placeholder")) return;

    let target = event.target;
    let id = event.dataTransfer.getData("id");

    target.classList.remove("hover");

    if (!target.dataset.id) {
        let currentPiece = document.getElementById(id);
        target.appendChild(currentPiece);
    }

    if (target.dataset.id === id) {
        target.appendChild(document.getElementById(id));
        game.placePiece(parseInt(id));
        if (game.history.length === settings.numberOfPieces) {
            handleWin();
        }
    }
});

document.addEventListener("contextmenu", function (event) {
    if (!event.target.matches(".piece")) return;
    event.preventDefault();
    event.target.classList.toggle("big");
    return false;
});

// Start the game.
if (puzzleContainer) {
    settings = getSettings();
    init(settings);
}
