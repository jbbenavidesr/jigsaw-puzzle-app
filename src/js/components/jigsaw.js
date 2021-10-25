import Reef from "reefjs";

let jigsaw = new Reef("#jigsaw", {
    data: {
        placed: [],
    },
    template: function (props) {
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
    },
});

export default jigsaw;
