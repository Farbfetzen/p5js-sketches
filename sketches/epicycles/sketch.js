// TODO: Find out why closed_hilbert loads so slowly and make it faster.
// TODO: Implement line trimming and fading from the python project.

const filename = "shapes/heart.txt";
const canvasWidth = 800;
const canvasHeight = 800;
// A number > 0 and <= 1 indicating how much of the width and height of the window the shape should occupy.
const scaleFactor = 0.8;
// Angular velocity in radians per second.
let angularVelocity = 1;
const minAngularVelocity = 1 / 32;
const maxAngularVelocity = 4;
// Interpolate if points are farther apart than this.
const maxDistance = 5;

let path;
let points = [];
let signal;
let time = 0;
let epicycleOrigin;
let currentAngle = 0;
let maxDeltaTime;

function preload() {
    loadStrings(filename, loadPath);
}

function loadPath(lines) {
    path = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line) {
            continue;
        }
        const point = line.split(" ");
        const x = Number(point[0]);
        const y = Number(point[1]);
        if (isNaN(x) || isNaN(y)) {
            throw new Error("Error in line " + i + " while trying to convert strings to numbers: " + line);
        }
        // Negate the y value because y increases downwards on the canvas.
        path.push(createVector(x, -y));
    }
}

function transformPath() {
    let maxX = -Infinity;
    let minX = Infinity;
    let maxY = -Infinity;
    let minY = Infinity;
    for (const p of path) {
        if (p.x > maxX) {
            maxX = p.x;
        } else if (p.x < minX) {
            minX = p.x;
        }
        if (p.y > maxY) {
            maxY = p.y;
        } else if (p.y < minY) {
            minY = p.y;
        }
    }

    // Center the shape around (0, 0).
    const center = createVector((maxX + minX) / 2, (maxY + minY) / 2);
    for (const p of path) {
        p.sub(center);
    }

    const pathWidth = maxX - minX;
    const pathHeight = maxY - minY;

    // Scale the shape to the desired size.
    const maxAllowedWidth = canvasWidth * scaleFactor;
    const maxAllowedHeight = canvasHeight * scaleFactor;
    let ratio;
    if (maxAllowedWidth <= maxAllowedHeight) {
        ratio = maxAllowedWidth / pathWidth;
    } else {
        ratio = maxAllowedHeight / pathHeight;
    }
    for (const p of path) {
        p.mult(ratio);
    }
}

/**
 * Discrete Fourier Transform
 *
 * Algorithm taken from Wikipedia: https://en.wikipedia.org/wiki/Discrete_Fourier_transform
 * X_k = SUM(n=0, N-1)(x_n * e^(-(i * 2 * PI * k * n) / N))
 */
function dft() {
    signal = [];
    const x = path.map((p) => math.complex(p.x, p.y));
    const N = path.length;
    const minusI2Pi = math.i.mul(math.tau).neg();
    for (let k = 0; k < N; k++) {
        let X_k = math.complex();
        for (let n = 0; n < N; n++) {
            X_k = X_k.add(x[n].mul(math.exp(minusI2Pi.mul((k * n) / N))));
        }
        const frequency = k > N / 2 ? k - N : k;
        const amplitude = X_k.abs() / N; // radius
        const phase = X_k.arg();
        signal.push({ frequency, amplitude, phase });
    }
}

function setOrigin() {
    const offset = signal.shift();
    epicycleOrigin = p5.Vector.fromAngle(offset.phase, offset.amplitude).add(width / 2, height / 2);
}

/**
 * Sort by frequency so the frequencies are in the order -1, 1, -2, 2, -3, 3, etc.
 * I feel this results in the most aesthetically pleasing animation.
 */
function sortEpicycles() {
    signal.sort((a, b) => {
        const absA = abs(a.frequency);
        const absB = abs(b.frequency);
        return absA !== absB ? absA - absB : a.frequency - b.frequency;
    });
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    noFill();
    maxDeltaTime = (1 / getTargetFrameRate()) * 1000 * 2;
    transformPath();
    dft();
    setOrigin();
    sortEpicycles();

    // Add first point to implify interpolation calculation.
    const p = getEpicyclesAtAngle(currentAngle, false);
    points.push(p);
}

function draw() {
    background(32);

    // Limit dt because deltaTime increases even when isLooping() is false.
    const dt = min(deltaTime, maxDeltaTime) / 1000;

    const previousAngle = currentAngle;
    currentAngle += angularVelocity * dt;
    const previousPoint = points[points.length - 1];
    const currentPoint = getEpicyclesAtAngle(currentAngle, true);
    if (previousPoint.dist(currentPoint) > maxDistance) {
        const [interpolatedPoints] = interpolate(previousPoint, previousAngle, currentPoint, currentAngle);
        points.push(...interpolatedPoints);
    }
    points.push(currentPoint);

    beginShape();
    stroke(0, 255, 255);
    strokeWeight(2);
    for (const p of points) {
        vertex(p.x, p.y);
    }
    endShape();

    if (currentAngle >= TWO_PI) {
        currentAngle -= TWO_PI;
        points = points.slice(-1);
    }
}

function interpolate(point1, angle1, point2, angle2) {
    const meanAngle = (angle1 + angle2) / 2;
    const meanPoint = getEpicyclesAtAngle(meanAngle, false);
    const resultPoints = [];
    const resultAngles = [];
    if (point1.dist(meanPoint) > maxDistance) {
        const [interpolatedPoints, interpolatedAngles] = interpolate(point1, angle1, meanPoint, meanAngle);
        resultPoints.push(...interpolatedPoints);
        resultAngles.push(...interpolatedAngles);
    }
    resultPoints.push(meanPoint);
    resultAngles.push(meanAngle);
    if (meanPoint.dist(point2) > maxDistance) {
        const [interpolatedPoints, interpolatedAngles] = interpolate(meanPoint, meanAngle, point2, angle2);
        resultPoints.push(...interpolatedPoints);
        resultAngles.push(...interpolatedAngles);
    }
    return [resultPoints, resultAngles];
}

function getEpicyclesAtAngle(angle, drawCircles) {
    let x = epicycleOrigin.x;
    let y = epicycleOrigin.y;
    strokeWeight(1);
    for (const s of signal) {
        const previousx = x;
        const previousY = y;
        const phi = s.frequency * angle + s.phase;
        x += s.amplitude * cos(phi);
        y += s.amplitude * sin(phi);

        if (drawCircles && s.amplitude >= 1) {
            stroke(128);
            ellipse(previousx, previousY, s.amplitude + s.amplitude);
            stroke(255);
            line(previousx, previousY, x, y);
        }
    }
    return createVector(x, y);
}

function keyPressed() {
    if (key === " ") {
        if (isLooping()) {
            noLoop();
        } else {
            loop();
        }
    } else if (key === "+" && angularVelocity < maxAngularVelocity) {
        angularVelocity *= 2;
    } else if (key == "-" && angularVelocity > minAngularVelocity) {
        angularVelocity /= 2;
    }
}
