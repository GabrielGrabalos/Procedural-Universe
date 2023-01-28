class System {
    constructor(star) {
        this.star = star;
        this.planets = star.planets;

        sysCanvas.style.display = 'block';
        document.getElementById('sysBack').style.display = 'flex';
        canvas.style.display = 'none';

        sysOffsetX = -sysCanvas.width / 2;
        sysOffsetY = -sysCanvas.height / 2;
        sysScale = 1;

        sysMinZoom = 0.125;
        sysMaxZoom = 8;

        sysDrag = false;
        sysDragStart;
        sysDragEnd;

        this.sysClick = true;
    }
}

let sysOffsetX;
let sysOffsetY;
let sysScale = 1;

let sysMinZoom = 0.5;
let sysMaxZoom = 8;

let sysDrag = false;
let sysDragStart;
let sysDragEnd;

let sysClick = true;

let selectedPlanet = null;
let hoveredAster = null;

function sysMousedown(event) {
    sysDragStart = {
        x: event.pageX - sysCanvas.offsetLeft,
        y: event.pageY - sysCanvas.offsetTop,
    }
    sysDrag = true;
}

function sysMousemove(event) {
    if (sysDrag) {
        if (sysClick) sysClick = false;

        sysDragEnd = {
            x: event.pageX - sysCanvas.offsetLeft,
            y: event.pageY - sysCanvas.offsetTop,
        };

        sysOffsetX -= (sysDragEnd.x - sysDragStart.x) / sysScale;
        sysOffsetY -= (sysDragEnd.y - sysDragStart.y) / sysScale;

        sysDragStart = sysDragEnd; // Resets the dragStart.

        // change the cursor to a grabbing hand:
        sysCanvas.style.cursor = 'grabbing';
    }
    else {
        sysClick = true;

        // change the cursor to a grabbing hand:
        sysCanvas.style.cursor = 'grab';

        // Checks if the mouse is over a planet:
        checkHoveredAster(sysGetCursorPosition(event));
    }

    sysClear();
    sysDraw();
}

function sysMouseup(event) { sysDrag = false; }

function sysWheel(event) {
    event.preventDefault();

    // Gets the cursor position:
    const mousePos = sysGetCursorPosition(event);

    // Mouse before zoom:
    const mouseBeforeZoomX = sysScreenToWorldX(mousePos.x);
    const mouseBeforeZoomY = sysScreenToWorldY(mousePos.y);

    // Zoom:
    sysScale += event.deltaY * -0.01 * sysScale / 10;
    sysScale = Math.min(Math.max(sysMinZoom, sysScale), sysMaxZoom);

    // Mouse after zoom:
    const mouseAfterZoomX = sysScreenToWorldX(mousePos.x);
    const mouseAfterZoomY = sysScreenToWorldY(mousePos.y);

    // Offset:
    sysOffsetX += mouseBeforeZoomX - mouseAfterZoomX;
    sysOffsetY += mouseBeforeZoomY - mouseAfterZoomY;

    // Draw:
    sysClear();
    sysDraw();
}

function checkHoveredAster(mouse) {
    const mouseDistance = Math.sqrt((mouse.x - sysWorldToScreenX(0)) ** 2 + (mouse.y - sysWorldToScreenY(0)) ** 2);

    // Checks if the mouse is over a planet:
    const numPlanets = system.planets.length;

    for (let i = 0; i < numPlanets; i++) {
        if (system == null) return;

        const planet = system.planets[i];

        if (mouseDistance < (planet.distance + planet.radius) * 10 * sysScale && mouseDistance > (planet.distance - planet.radius) * 10 * sysScale) {
            sysCanvas.style.cursor = 'pointer';
            hoveredAster = planet;
            return;
        }
    }

    // checks if the mouse is over te star:
    if (mouseDistance < (system.star.radius + 1) * 10 * sysScale) {
        sysCanvas.style.cursor = 'pointer';
        hoveredAster = system.star;

        return;
    }

    hoveredAster = null;
}

let lastTime = Date.now();
const fps = document.getElementById('fps');

function sysAnimate() {
    try {
        //logs the fps:
        //fps.innerHTML = 'Hover: ' + hoveredAster;//+ (1000 / (Date.now() - lastTime));
        //lastTime = Date.now();

        updateSystem();

        sysClear();
        sysDraw();

        requestAnimationFrame(sysAnimate);
    }
    catch (e) { }
}

function updateSystem() {
    system.star.planets.forEach(planet => {
        planet.sysUpdate();
        planet.sysUpdateMoons();
    });
}

function sysDrawPlanetsObirts() {
    if (sysCtx.lineWidth != 1) sysCtx.lineWidth = 1;
    // Only draws the orbit if it is in the screen:
    system.planets.forEach(planet => {
        if (sysWorldToScreenX(planet.x) > - planet.distance * 2 * 10 * sysScale && sysWorldToScreenX(planet.x) < sysCanvas.width + planet.distance * 2 * 10 * sysScale &&
            sysWorldToScreenY(planet.y) > - planet.distance * 2 * 10 * sysScale && sysWorldToScreenY(planet.y) < sysCanvas.height + planet.distance * 2 * 10 * sysScale) {
            planet.sysDrawOrbit();
        }
        else {
            return;
        }
    });
}

function sysDraw() {
    system.star.sysDraw();
    sysDrawPlanetsObirts();
    sysDrawPlanets();
    sysDrawHover();
}

function sysClear() {
    sysCtx.clearRect(0, 0, sysCanvas.width, sysCanvas.height);
}

function sysDrawPlanets() {
    // Only draws the planet if it is in the screen:
    system.planets.forEach(planet => {
        /*if (sysWorldToScreenX(planet.x) > - planet.radius * 10 * sysScale && sysWorldToScreenX(planet.x) < sysCanvas.width + planet.radius * 10 * sysScale &&
            sysWorldToScreenY(planet.y) > - planet.radius * 10 * sysScale && sysWorldToScreenY(planet.y) < sysCanvas.height + planet.radius * 10 * sysScale) {*/
        planet.sysDraw();
        planet.sysDrawMoonOrbits();
        planet.sysDrawMoons();
        /*}
        else {
            return;
        }*/
    });
}

function sysDrawHover() {
    if (hoveredAster !== null && !sysDrag) {
        hoveredAster.sysDrawCircle();
    }
}

function sysScreenToWorldX(x) { return (x) / sysScale + sysOffsetX; }

function sysScreenToWorldY(y) { return (y) / sysScale + sysOffsetY; }

function sysWorldToScreenX(x) { return (x - sysOffsetX) * sysScale; }

function sysWorldToScreenY(y) { return (y - sysOffsetY) * sysScale; }

function sysGetCursorPosition(event) {
    const rect = sysCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
}

function killSystem() {
    sysCanvas.style.display = 'none';
    document.getElementById('sysBack').style.display = 'none';
    canvas.style.display = 'block';
    // stop the animation:
    cancelAnimationFrame(sysAnimate);
    system = null;
}

/*
function sysDraw() {
    system.sysDrawStar();
    system.sysDrawPlanets();
}

function sysClear() {
    sysCtx.clearRect(-sysCanvas.width / 2, -sysCanvas.height / 2, sysCanvas.width, sysCanvas.height);
}

function sysDrawStar() {
    sysCtx.beginPath();
    sysCtx.arc(sysWorldToScreenX(0), sysWorldToScreenY(0), system.star.radius * system.sysScale, 0, 2 * Math.PI);
    sysCtx.fillStyle = system.star.color;
    sysCtx.fill();
}

function sysDrawPlanets() {
    system.planets.forEach(planet => {
        sysCtx.beginPath();
        sysCtx.arc(sysWorldToScreenX(planet.distance), sysWorldToScreenY(0), planet.radius * system.sysScale, 0, 2 * Math.PI);
        sysCtx.strokeStyle = 'white';
        sysCtx.lineWidth = 2 * system.sysScale;
        sysCtx.stroke();
    });
}

function sysScreenToWorldX(x) { return (x/* - sysCanvas.width / 2) / system.sysScale + system.sysOffsetX; }

function sysScreenToWorldY(y) { return (y/* - sysCanvas.height / 2) / system.sysScale + system.sysOffsetY; }

function sysWorldToScreenX(x) { return (x - system.sysOffsetX) * system.sysScale /*+ sysCanvas.width / 2; }

function sysWorldToScreenY(y) { return (y - system.sysOffsetY) * system.sysScale /*+ sysCanvas.height / 2;  }

function sysGetCursorPosition(event) {
    const rect = sysCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
}

function sysMousedown(event) {
    console.log("foi aqui");
    system.dragStart = {
        x: event.pageX - sysCanvas.offsetLeft,
        y: event.pageY - sysCanvas.offsetTop,
    }
    system.drag = true;
}

function sysMousemove(event) {
    if (system.drag) {
        if (system.click) system.click = false;

        system.dragEnd = {
            x: event.pageX - sysCanvas.offsetLeft,
            y: event.pageY - sysCanvas.offsetTop,
        };

        system.sysOffsetX -= (system.dragEnd.x - system.dragStart.x) / system.sysScale;
        system.sysOffsetY -= (system.dragEnd.y - system.dragStart.y) / system.sysScale;

        system.dragStart = system.dragEnd; // Resets the dragStart.

        // change the cursor to a grabbing hand:
        sysCanvas.style.cursor = 'grabbing';
    }
    else {
        system.click = true;

        // change the cursor to a grabbing hand:
        sysCanvas.style.cursor = 'grab';
    }

    system.sysClear();
    system.sysDraw();
}

function sysMouseup(event) { system.drag = false; }

function sysWheel(event) {
    event.preventDefault();

    // Gets the cursor position:
    const mousePos = sysGetCursorPosition(event);

    // Mouse before zoom:
    const mouseBeforeZoomX = sysScreenToWorldX(mousePos.x);
    const mouseBeforeZoomY = sysScreenToWorldY(mousePos.y);

    // Zoom:
    system.sysScale += event.deltaY * -0.01 * system.sysScale / 10;
    system.sysScale = Math.min(Math.max(system.minZoom, system.sysScale), system.maxZoom);

    // Mouse after zoom:
    const mouseAfterZoomX = sysScreenToWorldX(mousePos.x);
    const mouseAfterZoomY = sysScreenToWorldY(mousePos.y);

    // Offset:
    system.sysOffsetX += mouseBeforeZoomX - mouseAfterZoomX;
    system.sysOffsetY += mouseBeforeZoomY - mouseAfterZoomY;

    // Draw:
    system.sysClear();
    system.sysDraw();
}
*/