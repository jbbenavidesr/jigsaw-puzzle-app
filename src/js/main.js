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

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {Array}       The shuffled array
 */
function shuffle(array) {

    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;

}

/**
 * This function returns an svg path that will be the mask to place in a piece.
 * Each of the sides is made of 6 cubic bezier curves and all the sides are generated
 * from an array of 36 numbers.
 */
function getPieceMask(topTab, rightTab, bottomTab, leftTab, width, height) {

    let curvyCoords = [
        0, 0, 35, 15, 37, 5,
        37, 5, 40, 0, 38, -5,
        38, -5, 20, -20, 50, -20,
        50, -20, 80, -20, 62, -5,
        62, -5, 60, 0, 63, 5,
        63, 5, 65, 15, 100, 0
    ];

    let xRatio = 0.6 * width / 100;
    let yRatio = 0.6 * height / 100;

    let mask = "";

    let topLeftCorner = {
        x: 0.2 * width,
        y: 0.2 * height
    }

    mask += `M ${topLeftCorner.x} ${topLeftCorner.y}`;

    //Top
    for (let i = 0; i < curvyCoords.length / 6; i++) {
        let p1 = {
            x: topLeftCorner.x + curvyCoords[i * 6 + 0] * xRatio,
            y: topLeftCorner.y + topTab * curvyCoords[i * 6 + 1] * yRatio,
        }

        let p2 = {
            x: topLeftCorner.x + curvyCoords[i * 6 + 2] * xRatio,
            y: topLeftCorner.y + topTab * curvyCoords[i * 6 + 3] * yRatio,
        }

        let p3 = {
            x: topLeftCorner.x + curvyCoords[i * 6 + 4] * xRatio,
            y: topLeftCorner.y + topTab * curvyCoords[i * 6 + 5] * yRatio,
        }

        mask += ` C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;
    }

    // Right
    let topRightCorner = {
        x: topLeftCorner.x + 0.6 * width,
        y: topLeftCorner.y,
    }


    for (let i = 0; i < curvyCoords.length / 6; i++) {
        let p1 = {
            x: topRightCorner.x - rightTab * curvyCoords[i * 6 + 1] * xRatio,
            y: topRightCorner.y + curvyCoords[i * 6 + 0] * yRatio,
        }

        let p2 = {
            x: topRightCorner.x - rightTab * curvyCoords[i * 6 + 3] * xRatio,
            y: topRightCorner.y + curvyCoords[i * 6 + 2] * yRatio,
        }

        let p3 = {
            x: topRightCorner.x - rightTab * curvyCoords[i * 6 + 5] * xRatio,
            y: topRightCorner.y + curvyCoords[i * 6 + 4] * yRatio,
        }

        mask += ` C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;
    }

    // Bottom 
    let bottomRightCorner = {
        x: topRightCorner.x,
        y: topRightCorner.y + 0.6 * height,
    }
    mask += ` L ${bottomRightCorner.x} ${bottomRightCorner.y}`;
    for (let i = 0; i < curvyCoords.length / 6; i++) {
        let p1 = {
            x: bottomRightCorner.x - curvyCoords[i * 6 + 0] * xRatio,
            y: bottomRightCorner.y - bottomTab * curvyCoords[i * 6 + 1] * yRatio,
        }

        let p2 = {
            x: bottomRightCorner.x - curvyCoords[i * 6 + 2] * xRatio,
            y: bottomRightCorner.y - bottomTab * curvyCoords[i * 6 + 3] * yRatio,
        }

        let p3 = {
            x: bottomRightCorner.x - curvyCoords[i * 6 + 4] * xRatio,
            y: bottomRightCorner.y - bottomTab * curvyCoords[i * 6 + 5] * yRatio,
        }

        mask += ` C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;
    }

    // Left
    let bottomLeftCorner = {
        x: topLeftCorner.x,
        y: topLeftCorner.y + 0.6 * height,
    }

    for (let i = 0; i < curvyCoords.length / 6; i++) {
        let p1 = {
            x: bottomLeftCorner.x + leftTab * curvyCoords[i * 6 + 1] * xRatio,
            y: bottomLeftCorner.y - curvyCoords[i * 6 + 0] * yRatio,
        }

        let p2 = {
            x: bottomLeftCorner.x + leftTab * curvyCoords[i * 6 + 3] * xRatio,
            y: bottomLeftCorner.y - curvyCoords[i * 6 + 2] * yRatio,
        }

        let p3 = {
            x: bottomLeftCorner.x + leftTab * curvyCoords[i * 6 + 5] * xRatio,
            y: bottomLeftCorner.y - curvyCoords[i * 6 + 4] * yRatio,
        }

        mask += ` C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;
    }

    //
    return mask;
}

function getPuzzleState(props) {
    let puzzleState = [];

    for (let i = 0; i < numberOfPieces; i++) {
        puzzleState.push(props.placedPieces.includes(i) ? 1 : 0);
    }

    return puzzleState;
}

function getJigsaw(props) {
    let puzzleState = getPuzzleState(props);

    let mask = getPieceMask(1, -1, 0, 1, 150, 150)
    console.log(mask)
    let missingPieces = puzzleState
        .map(function (piece, index) {
            let content = "";
            if (piece === 0) {
                content = `
                <div class="piece" data-draggable 
                    id=${index} style="--path: path('${mask}')">
                        ${index}
                </div>`;
            }
            return content;
        })
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
                ${shuffle(missingPieces).join("")}
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