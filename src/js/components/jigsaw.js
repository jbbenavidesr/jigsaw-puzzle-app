import Reef from "reefjs";

import {
    getRandomShapes,
    shuffle,
} from "../utils";

//
// Variables
//

// Settings that should then become variable
let numberOfPieces = 16;
let image = "/img/skyscrappers.jpg"

//
// Methods
//

function createPieces(piecesPerSide, image) {

    // Get the shapes of the pieces
    let shapes = getRandomShapes(piecesPerSide);

    let pieces = shapes.map(function (shape) {
        return {
            mask: getMask(shape, 100, 100),
        }
    })

    return pieces;
}

function buildSolution(puzzleState, pieces) {
    return puzzleState
        .map(function (piece, index) {
            return `<div class="piece ${
                        piece === 1 ? "placed" : ""
                    }" data-dropzone data-id="${index}"
                    style="--path: path('${pieces[index].mask}')"></div>`;
        })
        .join("")
}

function buildMissingPieces(puzzleState, pieces) {
    return shuffle(puzzleState.map(function (piece, index) {
        let content = "";
        if (piece === 0) {
            content = `
                <div class="piece" draggable="true" 
                    id=${index} style="--path: path('${pieces[index].mask}')">
                        ${index}
                </div>`;
        }
        return content;
    })).join("");
}

/**
 * Create the template of the puzzle based on some parameters.
 */
function createTemplate(numberOfPieces, image) {

    // Determine number of pieces per side
    let piecesPerSide = Math.round(Math.sqrt(numberOfPieces));

    // Create an array with objects that represent the information of each piece.
    let pieces = createPieces(piecesPerSide, image);


    function template(props) {
        return `
            <div class="jigsaw">
                <div class="container solution">
                    ${buildSolution(props.currentState, pieces)}
                </div>
                <div class="container pieces">
                    ${buildMissingPieces(props.currentState, pieces)}
                </div>
            </div>
        `;
    }

    return template;
}

function getInitialState(numberOfPieces) {
    return new Array(numberOfPieces).fill(0)
}

const app = new Reef('#app', {
    data: {
        currentState: getInitialState(numberOfPieces),
    },
    template: createTemplate(numberOfPieces, image),
})

//
// Inits and Event Listeners
//

document.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("id", event.target.id);
});

document.addEventListener("dragover", function (event) {
    event.preventDefault();

    if (!event.target.closest('.solution .piece') || event.target.matches('.placed')) return;

    event.target.classList.add("hover");
});

document.addEventListener("dragleave", function (event) {
    if (!event.target.closest('.solution .piece') || event.target.matches('.placed')) return;
    event.target.classList.remove("hover");
});

document.addEventListener("drop", function (event) {
    if (!event.target.closest('.solution .piece') || event.target.matches('.placed')) return;

    event.target.classList.remove("hover");

    let id = event.dataTransfer.getData("id");

    if (event.target.dataset.id === id) {
        app.data.currentState[parseInt(id)] = 1;
    }
})



export default app;