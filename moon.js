class Moon {
    constructor(distanceFromPlanet) {
        this.distanceFromPlanet = distanceFromPlanet;
        this.y = -distanceFromPlanet;
    }

    radius;
    color;
    speed;
    distanceFromPlanet;
    planetsDistance; // distance from the star
    angle = 0;
    x;
    y;
    planetX;
    planetY;

    sysDraw() {
        sysCtx.beginPath();
        sysCtx.arc(sysWorldToScreenX(this.x), sysWorldToScreenY(this.y), this.radius * 10 * sysScale, 0, 2 * Math.PI);
        sysCtx.fillStyle = this.color;
        sysCtx.fill();
    }

    sysDrawCircle() {
        sysCtx.beginPath();
        sysCtx.arc(sysWorldToScreenX(this.x), sysWorldToScreenY(this.y), this.radius * 10 * sysScale, 0, 2 * Math.PI);
        sysCtx.strokeStyle = 'white';
        sysCtx.lineWidth = Math.max(1, 2 * sysScale);
        sysCtx.stroke();
    }

    sysDrawOrbit() {
        sysCtx.beginPath();
        sysCtx.arc(sysWorldToScreenX(this.planetX), sysWorldToScreenY(this.planetY), this.distanceFromPlanet * sysScale, 0, 2 * Math.PI);
        sysCtx.lineWidth = 1 // * sysScale;
        sysCtx.strokeStyle = 'rgba(255, 255, 255,' + 0.8 * sysScale + ')';
        sysCtx.stroke();
    }

    sysUpdate() {
        this.x = this.planetX + this.distanceFromPlanet * Math.cos(this.angle / this.distanceFromPlanet);
        this.y = this.planetY + this.distanceFromPlanet * Math.sin(this.angle / this.distanceFromPlanet);
        this.angle -= this.speed;

        if (this.angle / this.distanceFromPlanet > 2 * Math.PI) this.angle -= 2 * Math.PI * this.distanceFromPlanet;
    }
}