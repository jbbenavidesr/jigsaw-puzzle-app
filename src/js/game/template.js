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

export default createTemplate;