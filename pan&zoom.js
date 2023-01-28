function screenToWorldX(x) {
    return x / scale + offsetX;
}

function screenToWorldY(y) {
    return y / scale + offsetY;
}

function worldToScreenX(x) {
    return (x - offsetX) * scale;
}

function worldToScreenY(y) {
    return (y - offsetY) * scale;
}

let mouse = { x: 0, y: 0 };

function getCursorPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

function sysGetCursorPosition(event) {
    const rect = sysCanvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

let click = true;

// offset for panning:
let offsetX = 0; //Math.random() * 1000;
let offsetY = 0; //Math.random() * 1000;
let scale = 1;

// zoom limits:
const minZoom = 0.5;
const maxZoom = 8;

let drag = false;
let dragStart;
let dragEnd;

function mousedown(event) {
    dragStart = {
        x: event.pageX - canvas.offsetLeft,
        y: event.pageY - canvas.offsetTop,
    }
    drag = true;
}

function mousemove(event) {
    if (drag) {
        if (click) click = false;

        dragEnd = {
            x: event.pageX - canvas.offsetLeft,
            y: event.pageY - canvas.offsetTop,
        };

        offsetX -= (dragEnd.x - dragStart.x) / scale;
        offsetY -= (dragEnd.y - dragStart.y) / scale;

        dragStart = dragEnd; // Resets the dragStart.

        // change the cursor to a grabbing hand:
        canvas.style.cursor = 'grabbing';
    }
    else {
        click = true;

        const cursor = getCursorPosition(event);
        mouse.x = Math.floor(screenToWorldX(cursor.x) / 50) * 50;
        mouse.y = Math.floor(screenToWorldY(cursor.y) / 50) * 50;

        // change the cursor to a grabbing hand:
        canvas.style.cursor = 'grab';
    }

    clear();
    draw();
}

function mouseup(event) { drag = false; }

function wheel(event) {
    event.preventDefault();

    // Gets the cursor position:
    const mousePos = getCursorPosition(event);

    // Mouse before zoom:
    const mouseBeforeZoomX = screenToWorldX(mousePos.x);
    const mouseBeforeZoomY = screenToWorldY(mousePos.y);

    // Zoom:
    scale += event.deltaY * -0.01 * scale / 10;
    scale = Math.min(Math.max(minZoom, scale), maxZoom);

    // Mouse after zoom:
    const mouseAfterZoomX = screenToWorldX(mousePos.x);
    const mouseAfterZoomY = screenToWorldY(mousePos.y);

    // Offset:
    offsetX += mouseBeforeZoomX - mouseAfterZoomX;
    offsetY += mouseBeforeZoomY - mouseAfterZoomY;

    // Draw:
    clear();
    draw();
}

const speed = 40;
const acceptedKeys = {
    W() {
        offsetY -= speed / scale;
    },
    S() {
        offsetY += speed / scale;
    },
    A() {
        offsetX -= speed / scale;
    },
    D() {
        offsetX += speed / scale;
    },
    Q() {
        const mouseBeforeZoomX = screenToWorldX(canvas.width / 2);
        const mouseBeforeZoomY = screenToWorldY(canvas.height / 2);

        scale += speed / 200;
        scale = Math.min(Math.max(minZoom, scale), maxZoom);

        const mouseAfterZoomX = screenToWorldX(canvas.width / 2);
        const mouseAfterZoomY = screenToWorldY(canvas.height / 2);

        // Offset:
        offsetX += mouseBeforeZoomX - mouseAfterZoomX;
        offsetY += mouseBeforeZoomY - mouseAfterZoomY;
    },
    E() {
        const mouseBeforeZoomX = screenToWorldX(canvas.width / 2);
        const mouseBeforeZoomY = screenToWorldY(canvas.height / 2);

        scale -= speed / 200;
        scale = Math.min(Math.max(minZoom, scale), maxZoom);

        const mouseAfterZoomX = screenToWorldX(canvas.width / 2);
        const mouseAfterZoomY = screenToWorldY(canvas.height / 2);

        // Offset:
        offsetX += mouseBeforeZoomX - mouseAfterZoomX;
        offsetY += mouseBeforeZoomY - mouseAfterZoomY;
    }
}

// Path: pan&zoom.js