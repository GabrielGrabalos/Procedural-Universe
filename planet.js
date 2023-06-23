class Planet {
    constructor(distance) {
        this.distance = distance;
        this.radius = 10;
        this.color = 'white';
        this.speed = 0.1;
        this.angle = 0;
        this.x = this.distance * 10;
        this.y = 0;
    }

    temperature;
    radius;
    color;
    speed;
    distance;
    angle = 0;
    x;
    y;

    water;
    atmosphere;
    life;

    moons = [];

    sysUpdate() {
        this.x = this.distance * 10 * Math.cos(this.angle / this.distance);
        this.y = this.distance * 10 * Math.sin(this.angle / this.distance);
        this.angle -= this.speed;

        if (this.angle / this.distance > 2 * Math.PI) this.angle -= 2 * Math.PI * this.distance;
    }

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
        sysCtx.arc(sysWorldToScreenX(0), sysWorldToScreenY(0), this.distance * 10 * sysScale, 0, 2 * Math.PI);
        sysCtx.strokeStyle = 'white'//'rgba(255, 255, 255,' + 0.8 * sysScale + ')';
        sysCtx.lineWidth = 1  * sysScale;
        sysCtx.stroke();
    }

    sysUpdateMoons() {
        this.moons.forEach(moon => {
            moon.sysUpdate();
            moon.planetX = this.x;
            moon.planetY = this.y;
        });
    }

    sysDrawMoons() {
        this.moons.forEach(moon => {
            moon.sysDraw();
        });
    }

    sysDrawMoonOrbits() {
        this.moons.forEach(moon => {
            moon.sysDrawOrbit();
        });
    }
}