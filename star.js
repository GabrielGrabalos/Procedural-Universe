class Star {

    seed;
    exists = false;

    constructor(x, y, generateSystem = false) {
        this.x = x;
        this.y = y;

        this.seed = (x & 0xFFFF) << 16 | (y & 0xFFFF);

        this.exists = (this.randomInt(0, 20) == 1);

        if (!this.exists) return;

        this.radius = this.randomInt(5, 15);
        this.color = starColors[this.randomInt(0, starColors.length)];

        if (!generateSystem) return;

        this.generateSystem();
    }

    generateSystem() {
        this.planets = [];

        const planetCount = this.randomInt(0, 10);

        let lastDistance = 0;

        for (let i = 0; i < planetCount; i++) {
            const planet = new Planet(this.randomInt(50, 150) / 2 + lastDistance);

            planet.radius = this.randomDouble(1, 3);
            planet.speed = this.randomDouble(0.01, 0.1);
            planet.color = 'rgb(' + this.randomInt(0, 255) + ',' + this.randomInt(0, 255) + ',' + this.randomInt(0, 255) + ')';

            lastDistance = planet.distance;

            // generates moons:
            const moonCount = this.randomInt(0, 5);

            let lastMoonDistance = planet.radius * 10;

            for (let j = 0; j < moonCount; j++) {
                const moon = new Moon((this.randomInt(10, 50) + lastMoonDistance));

                moon.radius = this.randomDouble(0.5, 1);
                moon.speed = this.randomDouble(0.01, 0.1) * 5;
                moon.color = 'rgb(' + this.randomInt(0, 255) + ',' + this.randomInt(0, 255) + ',' + this.randomInt(0, 255) + ')';
                moon.x = planet.distance * 10;
                moon.planetsDistance = planet.distance * 10;

                lastMoonDistance = moon.distanceFromPlanet + moon.radius * 10;

                planet.moons.push(moon);
            }

            this.planets.push(planet);
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(worldToScreenX(this.x) + 25 * scale, worldToScreenY(this.y) + 25 * scale, this.radius * scale, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    drawCircle() {
        ctx.beginPath();
        ctx.arc(worldToScreenX(this.x) + 25 * scale, worldToScreenY(this.y) + 25 * scale, this.radius * scale, 0, 2 * Math.PI);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2 * scale;
        ctx.stroke();
    }

    sysDraw() {
        sysCtx.beginPath();
        sysCtx.arc(sysWorldToScreenX(0), sysWorldToScreenY(0), this.radius * 10 * sysScale, 0, 2 * Math.PI);
        sysCtx.fillStyle = this.color;
        sysCtx.fill();
    }

    sysDrawCircle() {
        sysCtx.beginPath();
        sysCtx.arc(sysWorldToScreenX(0), sysWorldToScreenY(0), this.radius * 10 * sysScale, 0, 2 * Math.PI);
        sysCtx.strokeStyle = 'white';
        sysCtx.lineWidth = Math.max(1, 2 * sysScale);
        sysCtx.stroke();
    }

    // random functions:
    random() {
        return Math.abs(Math.sin(this.seed++) * Math.sin(this.seed * 0.1) * 1000);
    }

    randomInt(min, max) {
        return Math.floor(this.random() % (max - min) + min);
    }

    randomDouble(min, max) {
        return this.random() % (max - min) + min;
    }
}

const starColors = ['#9d0208', '#dc2f02', '#e85d04', '#f48c06', '#d0f4de', '#faa307', '#800e13'];