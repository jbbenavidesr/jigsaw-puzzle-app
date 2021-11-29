/**
 * Build the svg path of a jigsaw puzzle piece. Adapted from:
 * https://www.codeproject.com/Articles/395453/Html5-Jigsaw-Puzzle#Clipping
 * 
 * @param {Object}  tabs    Object that holds the shape that each of the sides of the piece should have.
 * @param {Number}  width   Width in pixels of the piece 
 * @param {Number}  height  Height in pixels of the piece 
 * 
 * @return {String}         SVG path with the shape of the figure. 
 *  
 */
function getMask(tabs, dimensions) {
    const {
        width,
        height
    } = dimensions;


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
            y: topLeftCorner.y + tabs.top * curvyCoords[i * 6 + 1] * yRatio,
        }

        let p2 = {
            x: topLeftCorner.x + curvyCoords[i * 6 + 2] * xRatio,
            y: topLeftCorner.y + tabs.top * curvyCoords[i * 6 + 3] * yRatio,
        }

        let p3 = {
            x: topLeftCorner.x + curvyCoords[i * 6 + 4] * xRatio,
            y: topLeftCorner.y + tabs.top * curvyCoords[i * 6 + 5] * yRatio,
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
            x: topRightCorner.x - tabs.right * curvyCoords[i * 6 + 1] * xRatio,
            y: topRightCorner.y + curvyCoords[i * 6 + 0] * yRatio,
        }

        let p2 = {
            x: topRightCorner.x - tabs.right * curvyCoords[i * 6 + 3] * xRatio,
            y: topRightCorner.y + curvyCoords[i * 6 + 2] * yRatio,
        }

        let p3 = {
            x: topRightCorner.x - tabs.right * curvyCoords[i * 6 + 5] * xRatio,
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
            y: bottomRightCorner.y - tabs.bottom * curvyCoords[i * 6 + 1] * yRatio,
        }

        let p2 = {
            x: bottomRightCorner.x - curvyCoords[i * 6 + 2] * xRatio,
            y: bottomRightCorner.y - tabs.bottom * curvyCoords[i * 6 + 3] * yRatio,
        }

        let p3 = {
            x: bottomRightCorner.x - curvyCoords[i * 6 + 4] * xRatio,
            y: bottomRightCorner.y - tabs.bottom * curvyCoords[i * 6 + 5] * yRatio,
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
            x: bottomLeftCorner.x + tabs.left * curvyCoords[i * 6 + 1] * xRatio,
            y: bottomLeftCorner.y - curvyCoords[i * 6 + 0] * yRatio,
        }

        let p2 = {
            x: bottomLeftCorner.x + tabs.left * curvyCoords[i * 6 + 3] * xRatio,
            y: bottomLeftCorner.y - curvyCoords[i * 6 + 2] * yRatio,
        }

        let p3 = {
            x: bottomLeftCorner.x + tabs.left * curvyCoords[i * 6 + 5] * xRatio,
            y: bottomLeftCorner.y - curvyCoords[i * 6 + 4] * yRatio,
        }

        mask += ` C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;
    }

    //
    return mask;
}

export default getMask;