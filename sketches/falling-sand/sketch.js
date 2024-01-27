const cellSize = 5;
const creationRadius = 10; // in grid units
const newGrainsPerFrame = 100;
let grid;
let currentHue;

class Grid {
    width;
    height;
    size;
    grid;

    constructor() {
        this.width = width / cellSize;
        this.height = height / cellSize;
        this.size = this.width * this.height;
        this.grid = Array(this.size).fill(null);
    }

    xyToIndex(x, y) {
        return floor(x + y * this.width);
    }

    setAt(x, y, value) {
        if (this.isInBounds(x, y)) {
            this.grid[this.xyToIndex(x, y)] = value;
        }
    }

    getAt(x, y) {
        if (this.isInBounds(x, y)) {
            return this.grid[this.xyToIndex(x, y)];
        }
    }

    isInBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
}

function setup() {
    createCanvas(600, 600);
    noStroke();
    colorMode(HSL, 100);
    grid = new Grid();
}

function draw() {
    background(0);

    if (mouseIsPressed) {
        createSand();
    }

    // Go from the bottom to the top so cells are only updated once per frame as they fall down.
    for (let y = grid.height - 1; y >= 0; y--) {
        for (let x = 0; x < grid.width; x++) {
            const cellHue = grid.getAt(x, y);
            if (cellHue !== null) {
                const [newX, newY] = getNextParticlePosition(x, y);
                if (newX !== x || newY !== y) {
                    grid.setAt(x, y, null);
                    grid.setAt(newX, newY, cellHue);
                }
                fill(color(cellHue, 100, 50));
                square(newX * cellSize, newY * cellSize, cellSize);
            }
        }
    }
}

function createSand() {
    for (let i = 0; i < newGrainsPerFrame; i++) {
        const v = p5.Vector.random2D()
            .setMag(random(creationRadius * cellSize))
            .add(mouseX, mouseY);
        const cellX = floor(v.x / cellSize);
        const cellY = floor(v.y / cellSize);
        if (!grid.getAt(cellX, cellY)) {
            grid.setAt(cellX, cellY, currentHue);
        }
    }
}

function mousePressed() {
    currentHue = random(100);
}

function getNextParticlePosition(x, y) {
    const below = y + 1;
    if (below === grid.height) {
        return [x, y];
    }

    if (grid.getAt(x, below) === null) {
        return [x, below];
    }

    const left = x - 1;
    const right = x + 1;
    let bottomLeftIsAvailable = left > -1 && grid.getAt(left, below) === null;
    let bottomRightIsAvailable = right < grid.width && grid.getAt(right, below) === null;
    if (bottomLeftIsAvailable) {
        if (bottomRightIsAvailable) {
            return [random([left, right]), below];
        } else {
            return [left, below];
        }
    } else if (bottomRightIsAvailable) {
        return [right, below];
    }

    return [x, y];
}
