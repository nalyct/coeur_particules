```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width;
let height;

const floatParticles = [];
const burstParticles = [];

const FLOAT_COUNT = 140;
const BURST_COUNT = 140;

const colors = [
    "#3b82f6",
    "#93c5fd",
    "#bfdbfe",
    "#60a5fa",
    "#2563eb",
    "#1d4ed8"
];

// Adapter le canvas à la taille de l'écran
function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


// ================================
// PARTICULES FLOTTANTES
// ================================

class Particle {

    constructor(x, y, type) {
        this.x = x;
        this.y = y;

        this.type = type;

        this.size = Math.random() * 3 + 1;

        this.color =
            colors[Math.floor(Math.random() * colors.length)];

        this.alpha = Math.random() * 0.7 + 0.3;

        if (type === "float") {

            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;

            this.maxLife = Math.random() * 500 + 300;
            this.life = Math.random() * this.maxLife;

        } else {

            this.speedX = 0;
            this.speedY = 0;

            this.life = 0;
            this.maxLife = 100;
        }
    }


    update() {

        // Particules qui flottent
        if (this.type === "float") {

            this.x += this.speedX;
            this.y += this.speedY;

            this.life++;

            // Réapparaît de l'autre côté
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;

            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

        }


        // Particules du cœur
        if (this.type === "burst") {

            this.x += this.speedX;
            this.y += this.speedY;

            this.speedX *= 0.98;
            this.speedY *= 0.98;

            this.life++;

            this.alpha -= 0.008;
        }
    }


    draw() {

        ctx.save();

        ctx.globalAlpha = this.alpha;

        ctx.fillStyle = this.color;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }
}


// ================================
// CRÉATION DES PARTICULES
// ================================

function createFloatingParticles() {

    for (let i = 0; i < FLOAT_COUNT; i++) {

        const particle = new Particle(
            Math.random() * width,
            Math.random() * height,
            "float"
        );

        floatParticles.push(particle);
    }
}


// ================================
// EXPLOSION EN FORME DE CŒUR
// ================================

function spawnHeartBurst(x, y) {

    for (let i = 0; i < BURST_COUNT; i++) {

        const t =
            Math.random() * Math.PI * 2;

        // Formule mathématique d'un cœur
        const heartX =
            16 * Math.pow(Math.sin(t), 3);

        const heartY =
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t);


        const scale =
            Math.random() * 3 + 2;


        const particle =
            new Particle(x, y, "burst");


        particle.x =
            x + heartX * scale;

        particle.y =
            y - heartY * scale;


        // Petite dispersion
        particle.speedX =
            (Math.random() - 0.5) * 0.8;

        particle.speedY =
            (Math.random() - 0.5) * 0.8;


        particle.size =
            Math.random() * 2.5 + 1;


        burstParticles.push(particle);
    }
}


// ================================
// CLIC
// ================================

canvas.addEventListener("click", (event) => {

    spawnHeartBurst(
        event.clientX,
        event.clientY
    );

});


// ================================
// ANIMATION
// ================================

function animate() {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    // Particules flottantes
    for (const particle of floatParticles) {

        particle.update();
        particle.draw();
    }


    // Particules du cœur
    for (let i = burstParticles.length - 1; i >= 0; i--) {

        const particle =
            burstParticles[i];

        particle.update();
        particle.draw();


        // Supprimer les particules
        if (particle.alpha <= 0) {

            burstParticles.splice(i, 1);
        }
    }


    requestAnimationFrame(animate);
}


// Démarrage
createFloatingParticles();
animate();
```
