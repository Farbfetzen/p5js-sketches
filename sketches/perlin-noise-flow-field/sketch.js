const xyOffsetPerPixel = 0.01;
let zOffset = 0;
const zIncrementPerframe = 0.01;
const particles = [];
const wrapAroundEdges = false;
// Multiply the noise by noiseWidth to widen it and thus the angles.
// Otherwise, the force mostly points to the right (PI radians).
const noiseWidth = 4;

function setup() {
    createCanvas(600, 600);
    strokeWeight(2);
    strokeCap(SQUARE);
    colorMode(HSL, TWO_PI, 1, 1, 1);
    background(220);
    for (let i = 0; i < 5000; i++) {
        particles[i] = new Particle();
    }
}

function draw() {
    zOffset += zIncrementPerframe;
    for (const particle of particles) {
        particle.update();
        particle.show();
    }
    if (frameCount >= 600) {
        noLoop();
    }
}
