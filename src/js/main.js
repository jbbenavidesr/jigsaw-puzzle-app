import "@interactjs/auto-start";
import "@interactjs/actions/drag";
import "@interactjs/actions/drop";
import "@interactjs/dev-tools";
import interact from "@interactjs/interact";
import jigsaw from "./components/jigsaw";

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

function dragMoveListener(event) {
    var target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    // translate the element
    target.style.transform = "translate(" + x + "px, " + y + "px)";

    // update the posiion attributes
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
}
