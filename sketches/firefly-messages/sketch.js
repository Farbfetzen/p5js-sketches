// Goal: Have particles forming words one after the other.
// Like the helpful fireflies from Abe's Oddysee.

const message = "these lights will guide you";
const recordGif = false;
const numberOfFlies = 1000;
const maxSpeed = 10;
const maxTargetRadius = 200;
const targetEllipseFactor = 2;
const flySize = 5;
const glowSize = flySize * 3;
const showTargets = false;
const maxTextSize = 200;
const textMargin = 50;
// Count frames instead of using deltaTime because saveGif() does not work with the timing.
// All frame counts assume 60 fps.
const initialDelay = 120;
const wordDuration = 90;
const spaceDuration = 30;
const fireflies = [];
let recordingFrameCount;
let recordingDelay;
let center;
let randomMode = true;
let targetsPerWord = [];
let wordIndex = 0;
let frameCounter = 0;
let frameCountForNextStep = initialDelay;

class Particle {
    position = createVector(random(width), random(height));
    velocity = p5.Vector.random2D();
    target;
    hue = random(30, 70);
    flyColor = color(this.hue, 100, 50, 50);
    glowColor = color(this.hue, 100, 50, 25);

    constructor() {
        this.randomTarget();
    }

    randomTarget() {
        this.target = p5.Vector.random2D().setMag(random(maxTargetRadius));
        this.target.x *= targetEllipseFactor;
        this.target.add(center);
    }

    update() {
        let difference = p5.Vector.sub(this.target, this.position);
        let distance = difference.mag();
        // Set the distance cutoff to 1 so the flies keep vibrating a little near their targets.
        if (distance > 1) {
            difference.setMag(randomMode ? 1 : 1.1);
            this.velocity.add(difference);
            this.velocity.limit(randomMode ? maxSpeed : sqrt(distance));
        }
        this.position.add(this.velocity);

        // Move the target around to achieve erratic flight paths instead of orbits.
        if (randomMode && random() < 0.05) {
            this.randomTarget();
        }
    }

    drawFly() {
        fill(this.flyColor);
        circle(this.position.x, this.position.y, flySize);
    }

    drawGlow() {
        fill(this.glowColor);
        circle(this.position.x, this.position.y, glowSize);
    }
}

function setup() {
    createCanvas(1080, 608); // 16:9 aspect ratio
    center = createVector(width / 2, height / 2);
    colorMode(HSL, 360, 100, 100, 100);
    noStroke();
    rectMode(CENTER);
    const words = message.trim().split(/\s/);
    prepareTargets(words);
    recordingFrameCount = int(initialDelay + wordDuration * words.length + spaceDuration * (words.length - 1));
    recordingDelay = int(initialDelay / 2);
    for (let i = 0; i < numberOfFlies; i++) {
        fireflies.push(new Particle());
    }
}

function draw() {
    if (frameCount === frameCountForNextStep) {
        step();
    }

    if (recordGif && frameCount == recordingDelay) {
        saveGif("firefly-messages", recordingFrameCount, { units: "frames" });
    }

    background(240, 100, 6);
    for (const fly of fireflies) {
        fly.update();
        if (showTargets) {
            fill(290, 100, 50);
            square(fly.target.x, fly.target.y, flySize);
        }
        fly.drawGlow();
    }
    // It looks better if the flies and teir glow are drawn in separate loops.
    for (const fly of fireflies) {
        fly.drawFly();
    }
}

function step() {
    randomMode = !randomMode;
    if (randomMode) {
        for (const fly of fireflies) {
            fly.randomTarget();
        }
        if (wordIndex >= targetsPerWord.length) {
            wordIndex = 0;
            frameCountForNextStep += initialDelay;
        } else {
            frameCountForNextStep += spaceDuration;
        }
    } else {
        for (let i = 0; i < numberOfFlies; i++) {
            const target = targetsPerWord[wordIndex][i];
            fireflies[i].target.set(target.x, target.y);
        }
        wordIndex++;
        frameCountForNextStep += wordDuration;
    }
}

function prepareTargets(words) {
    const textColor = color(360, 100, 100);
    fill(textColor);
    const textColorRedChannel = int(red(textColor));
    textAlign(CENTER, CENTER);
    for (const word of words) {
        let currentTextSize = maxTextSize;
        textSize(currentTextSize);
        // Shrink text if the word is too wide.
        while (textWidth(word) > width - textMargin * 2) {
            currentTextSize--;
            textSize(currentTextSize);
        }
        text(word, center.x, center.y);

        const coordinates = [];
        loadPixels();
        for (let i = 0; i < pixels.length / 4; i++) {
            if (pixels[i * 4] === textColorRedChannel) {
                const x = i % width;
                const y = int(i / width);
                coordinates.push(createVector(x, y));
            }
        }
        const targets = [];
        for (let i = 0; i < numberOfFlies; i++) {
            targets.push(coordinates[int(random(coordinates.length))]);
        }
        targetsPerWord.push(targets);
        background(0);
    }
}
