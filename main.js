window.onload = function () {
    canvasSetup();
    canvasResize();

    sysCanvasSetup();
    sysCanvasResize();

    draw();
}

window.onresize = function () {
    canvasResize();
    sysCanvasResize();

    draw();

    if (system) {
        sysDraw();
    }
}

window.addEventListener('keydown', keypress);

let canvas;
let ctx;

function canvasSetup() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // mouse events:
    canvas.addEventListener('mousedown', mousedown);
    canvas.addEventListener('mousemove', mousemove);
    canvas.addEventListener('mouseup', mouseup);
    canvas.addEventListener('wheel', wheel);
    canvas.addEventListener('click', mouseclick);
}

function canvasResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function keypress(event) {
    const key = event.key.toUpperCase();
    const action = acceptedKeys[key];
    if (action && system === null) {
        action();
        clear();
        draw();
    }
    return;
}

function mouseclick(event) {
    if (!click) return;

    const clickedStar = new Star(mouse.x, mouse.y);

    if (clickedStar.exists) {
        clickedStar.generateSystem();
        //console.log(clickedStar);
        system = new System(clickedStar);
        sysClear();
        sysDraw();
        sysAnimate();
    }
}

// system canvas:

let sysCanvas;
let sysCtx;

let system = null;

function sysCanvasSetup() {
    sysCanvas = document.getElementById('sysCanvas');
    sysCtx = sysCanvas.getContext('2d');

    // mouse events:
    sysCanvas.addEventListener('mousedown', sysMousedown);
    sysCanvas.addEventListener('mousemove', sysMousemove);
    sysCanvas.addEventListener('mouseup', sysMouseup);
    sysCanvas.addEventListener('wheel', sysWheel);
    // sysCanvas.addEventListener('click', mouseclick);
}

function sysCanvasResize() {
    sysCanvas.width = window.innerWidth;
    sysCanvas.height = window.innerHeight;
}