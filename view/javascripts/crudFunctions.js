/*
 * Function getting element under the mouse cursor to know which one to update when dropped
 */
var mouseX = 0, mouseY = 0;

document.documentElement.onmousemove = function(e) {
    e = e || window.event;
    mouseX = e.clientX;
    mouseY = e.clientY;
};

function getElementUnderMouse() {
    return document.elementFromPoint(mouseX, mouseY);
}

function remove() {
    socket.emit("removeUsed", arguments[0]);
}