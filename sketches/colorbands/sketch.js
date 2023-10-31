function setup() {
    createCanvas(400, 400);
    pixelDensity(1);
    noLoop();
    colorMode(HSL, 1);
}

function draw() {
    const increment = 0.005;
    loadPixels();
    let yOffset = 0;
    for (let y = 0; y < height; y++) {
        let xOffset = 0;
        for (let x = 0; x < width; x++) {
            const index = (x + y * width) * 4;
            // Remove the first fractional value
            // to get all possible colors from the normal distributed noise.
            const hue = (noise(xOffset, yOffset) * 10) % 1;
            const c = color(hue, 1, 0.5);
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
