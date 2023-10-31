const increment = 0.01;

function setup() {
    createCanvas(400, 400);
    pixelDensity(1);
    noLoop();
}

function draw() {
    loadPixels();
    let yOffset = 0;
    for (let y = 0; y < height; y++) {
        let xOffset = 0;
        for (let x = 0; x < width; x++) {
            const index = (x + y * width) * 4;
            const r = noise(xOffset, yOffset) * 255;
            pixels[index] = r;
            pixels[index + 1] = r;
            pixels[index + 2] = r;
            pixels[index + 3] = 255;
            xOffset += increment;
        }
        yOffset += increment;
    }
    updatePixels();
}
