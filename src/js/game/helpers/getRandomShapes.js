import shuffle from "../../utils/shuffle";

/**
 * Create the shapes of the pieces.
 */
function getRandomShapes(piecesPerSide) {
    let shapeArray = new Array();

    for (let y = 0; y < piecesPerSide; y++) {
        for (let x = 0; x < piecesPerSide; x++) {

            let topTab = undefined;
            let rightTab = undefined;
            let bottomTab = undefined;
            let leftTab = undefined;

            if (y == 0)
                topTab = 0;

            if (y == piecesPerSide - 1)
                bottomTab = 0;

            if (x == 0)
                leftTab = 0;

            if (x == piecesPerSide - 1)
                rightTab = 0;

            shapeArray.push(
                ({
                    top: topTab,
                    right: rightTab,
                    bottom: bottomTab,
                    left: leftTab
                })
            );
        }
    }

    for (let y = 0; y < piecesPerSide; y++) {
        for (let x = 0; x < piecesPerSide; x++) {

            let shape = shapeArray[y * piecesPerSide + x];

            let shapeRight = (x < piecesPerSide - 1) ?
                shapeArray[y * piecesPerSide + (x + 1)] :
                undefined;

            let shapeBottom = (y < piecesPerSide - 1) ?
                shapeArray[(y + 1) * piecesPerSide + x] :
                undefined;

            shape.right = (x < piecesPerSide - 1) ?
                getRandomTabValue() :
                shape.right;

            if (shapeRight)
                shapeRight.left = -shape.right;

            shape.bottom = (y < piecesPerSide - 1) ?
                getRandomTabValue() :
                shape.bottom;

            if (shapeBottom)
                shapeBottom.top = -shape.bottom;
        }
    }
    return shapeArray;
}

function getRandomTabValue() {
    return shuffle([-1, 1])[0];
}

export default getRandomShapes;