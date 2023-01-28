function draw() {
    // draws dots (circles) in lines intersections:
    const width = screenToWorldX(canvas.width) + 50;
    const height = screenToWorldY(canvas.height) + 50;

    /*/ draws vertical lines:
    for (let i = screenToWorldX(0) - offsetX % 50; i <= width; i += 50) {
        drawLine(worldToScreenX(i), (0), worldToScreenX(i), (canvas.height), 'white');
    }

    // draws horizontal lines:
    for (let j = screenToWorldY(0) - offsetY % 50; j <= height; j += 50) {
        drawLine((0), worldToScreenY(j), (canvas.width), worldToScreenY(j), 'white');
    }*/

    for (let i = screenToWorldX(0) - offsetX % 50; i <= width; i += 50) {
        for (let j = screenToWorldY(0) - offsetY % 50; j <= height; j += 50) {
            //drawCircle(worldToScreenX(i), worldToScreenY(j), 4 * scale, 'white');

            let star = new Star((i - 50), (j - 50));

            if (star.exists) {
                star.draw();
            }
        }
    }

    // checks mouse hover:
    const hover = new Star(mouse.x, mouse.y);

    if (hover.exists && !drag) {
        hover.drawCircle();

        // changes cursor:
        if(click)
        canvas.style.cursor = 'pointer';
    }
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawLine(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}