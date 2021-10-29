import "@interactjs/auto-start";
import "@interactjs/actions/drag";
import "@interactjs/actions/drop";
import "@interactjs/dev-tools";
import interact from "@interactjs/interact";
import Reef from "reefjs";

//
// Variables
//
const numberOfPieces = 16;

/** 
 * 
 * 
 * m 10 40 C 10 40 45 25 47 35 
 *         C 47 35 50 40 48 45 
 *         C 48 45 30 60 60 60 
 *         C 60 60 90 60 72 45 
 *         C 72 45 70 40 73 35 
 *         C 73 35 75 25 110 40 
 */
//
// Methods
//

function getPuzzleState(props) {
    let puzzleState = [];

    for (let i = 0; i < numberOfPieces; i++) {
        puzzleState.push(props.placedPieces.includes(i) ? 1 : 0);
    }

    return puzzleState;
}

function getJigsaw(props) {
    let puzzleState = getPuzzleState(props);

    return `
        <div class="jigsaw">
            <div class="container solution">
                ${puzzleState
                    .map(function (piece, index) {
                        return `<div class="piece ${
                            piece === 1 ? "placed" : ""
                        }" data-dropzone data-id="${index}"></div>`;
                    })
                    .join("")}
            </div>
            <div class="container pieces">
                ${puzzleState
                    .map(function (piece, index) {
                        let content = "";
                        if (piece === 0) {
                            content = `<div class="piece" data-draggable id=${index}>${index}</div>`;
                        }
                        return content;
                    })
                    .join("")}
            </div>
        </div>
    `;
}

function dragMoveListener(event) {
    let target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    let y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    // translate the element
    target.style.transform = "translate(" + x + "px, " + y + "px)";

    // update the posiion attributes
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
}

const app = new Reef('#app', {
    data: {
        placedPieces: [],
    },
    template: getJigsaw,
})

//
// Inits & Event Listeners
//


interact("[data-draggable]").draggable({
    // enable autoScroll
    autoScroll: true,

    listeners: {
        // call this function on every dragmove event
        move: dragMoveListener,

        // call this function on every dragend event
        end(event) {
            console.log("end");
        },
    },
});

interact("[data-dropzone]").dropzone({
    ondrop: function (event) {
        let target = event.target;
        let piece = event.relatedTarget;

        if (piece.id === target.getAttribute("data-id")) {
            app.data.placedPieces.push(parseInt(piece.id));
            console.log(`place ${piece.id}`);
        } else {
            piece.style.transform = "none";
            // update the posiion attributes
            piece.setAttribute("data-x", 0);
            piece.setAttribute("data-y", 0);
        }
    },
});

app.render();