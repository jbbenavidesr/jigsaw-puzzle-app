import "@interactjs/auto-start";
import "@interactjs/actions/drag";
import "@interactjs/actions/drop";
import "@interactjs/dev-tools";
import interact from "@interactjs/interact";
import Reef from "reefjs";

//
// Variables
//
let jigsaw = new Reef("#jigsaw", {
    data: {
        placed: [],
    },
    template,
});

//
// Methods
//

function template(props) {
    let numPieces = 16;
    let placedContainer = [];

    for (let i = 0; i < numPieces; i++) {
        placedContainer.push(props.placed.includes(i) ? 1 : 0);
    }

    return `
        <div class="jigsaw">
            <div class="container solution">
                ${placedContainer
                    .map(function (piece, index) {
                        return `<div class="piece ${
                            piece === 1 ? "placed" : ""
                        }" data-dropzone data-id="${index}">${index}</div>`;
                    })
                    .join("")}
            </div>
            <div class="container pieces">
                ${placedContainer
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

//
// Inits & Event Listeners
//

jigsaw.render();

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
            jigsaw.data.placed.push(parseInt(piece.id));
            console.log(`place ${piece.id}`);
        } else {
            piece.style.transform = "none";
            // update the posiion attributes
            piece.setAttribute("data-x", 0);
            piece.setAttribute("data-y", 0);
        }
    },
});