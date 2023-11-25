const increment = 0.01;

function setup() {
    createCanvas(400, 400);
    pixelDensity(1);
    colorMode(HSL, 1);
    noLoop();
}

function draw() {
    loadPixels();
    let yOffset = 0;
    for (let y = 0; y < height; y++) {
        let xOffset = 0;
        for (let x = 0; x < width; x++) {
            const hue = (noise(xOffset, yOffset) * 2) % 1;
            const c = color(hue, 0.8, 0.5);
            const index = (x + y * width) * 4;
            pixels[index] = red(c);
            pixels[index + 1] = green(c);
            pixels[index + 2] = blue(c);
            pixels[index + 3] = 255;
            xOffset += increment;
        }
        yOffset += increment;
    }
    updatePixels();
}
