const greenOffset = 10;
const blueOffset = greenOffset * 2;
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
            let n = noise(xOffset, yOffset) * 255;
            // The results from noise() are concentrated around 0.5 and rarely go beyond 0.2 or 0.8.
            // This transforms the value so the colors become more vibrant.
            n = map(n, 50, 200, 0, 255);
            n = constrain(n, 0, 255);
            pixels[index] = n;
            pixels[index + 1] = noise(xOffset + greenOffset, yOffset + greenOffset) * 255;
            pixels[index + 2] = noise(xOffset + blueOffset, yOffset + blueOffset) * 255;
            pixels[index + 3] = 255;
            xOffset += increment;
        }
        yOffset += increment;
    }
    updatePixels();
}
