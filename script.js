const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width;
let height;

const floatParticles = [];
const burstParticles = [];

const FLOAT_COUNT = 140;
const BURST_COUNT = 180;

const colors = [
    "#3b82f6",
    "#93c5fd",
    "#bfdbfe",
    "#60a5fa",
    "#2563eb",
    "#1d4ed8"
];


// ================================
// TAILLE DU CANVAS
// ================================

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// ================================
// PARTICULE
// ================================

class Particle {

    constructor(x, y, type) {

        this.x = x;
        this.y = y;

        this.type = type;

        this.color =
            colors[Math.floor(Math.random() * colors.length)];

        this.size = Math.random() * 2.5 + 1;

        this.alpha = 1;


        // Particules flottantes
        if (type === "float") {

            this.speedX =
                (Math.random() - 0.5) * 0.4;

            this.speedY =
                (Math.random() - 0.5) * 0.4;
        }


        // Particules du cœur
        if (type === "burst") {

            this.speedX =
                (Math.random() - 0.5) * 0.5;

            this.speedY =
                (Math.random() - 0.5) * 0.5;
        }
    }


    update() {

        this.x += this.speedX;
        this.y += this.speedY;


        // Particules flottantes
        if (this.type === "float") {

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;

            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }


        // Particules du cœur
        if (this.type === "burst") {

            this.alpha -= 0.015;

            this.speedX *= 0.98;
            this.speedY *= 0.98;
        }
    }


    draw() {

        ctx.save();

        ctx.globalAlpha = this.alpha;

        ctx.fillStyle = this.color;

        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

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
// PARTICULES FLOTTANTES
// ================================

for (let i = 0; i < FLOAT_COUNT; i++) {

    floatParticles.push(
        new Particle(
            Math.random() * width,
            Math.random() * height,
            "float"
        )
    );
}


// ================================
// CRÉER UN CŒUR
// ================================

function spawnHeartBurst(x, y) {

    for (let i = 0; i < BURST_COUNT; i++) {

        const t =
            Math.random() * Math.PI * 2;


        // Formule du cœur
        const heartX =
            16 * Math.pow(Math.sin(t), 3);

        const heartY =
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t);


        const scale =
            Math.random() * 2.5 + 3;


        const particle =
            new Particle(x, y, "burst");


        particle.x =
            x + heartX * scale;

        particle.y =
            y - heartY * scale;


        particle.size =
            Math.random() * 2 + 1;


        burstParticles.push(particle);
    }
}


// ================================
// CLIC SUR L'ÉCRAN
// ================================

canvas.addEventListener("click", function(event) {

    console.log("Clic détecté !");

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


    // Cœurs
    for (let i = burstParticles.length - 1; i >= 0; i--) {

        const particle =
            burstParticles[i];

        particle.update();
        particle.draw();


        if (particle.alpha <= 0) {

            burstParticles.splice(i, 1);
        }
    }


    requestAnimationFrame(animate);
}

animate();

