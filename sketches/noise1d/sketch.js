const increment = 0.02;
let start = 0;

function setup() {
    createCanvas(400, 400);
    stroke(0);
    noFill();
}

function draw() {
    background(240);
    let xOffset = start;
    beginShape();
    for (let x = 0; x < width; x++) {
        const y = noise(xOffset) * height;
        xOffset += increment;
        vertex(x, y);
    }
    endShape();
    start += increment;
}
