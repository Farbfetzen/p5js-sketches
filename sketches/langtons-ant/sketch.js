// directions: 0 = right, 1 = down, 2 = left, 3 = up
// turning: -1 = left, 0 = straight, 1 = right, 2 = turn around
// rules: index = cell state, value = turn direction

const ruleCollection = {
    classic: [1, -1],
    filled_triangle: [1, 1, -1, 1, -1, 1, 1],
    filled_square: [1, 1, -1, 1, 1],
    filled_corner: [1, 1, -1, 1, -1, -1],
    highway_heaven: [-1, -1, -1, 1, 1, 1],
    highway_square: [-1, 1, 1, 1, 1, 1, -1, -1, 1],
    triangles: [1, 1, -1, -1, -1, 1, -1, -1, -1, 1, 1, 1],
    rectangle_symmetry: [1, -1, -1, 1],
    round_symmetry_1: [-1, -1, 1, 1],
    round_symmetry_2: [-1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1, 1],
    chaos: [1, -1, 1],
};
const rules = ruleCollection.classic;
const cellSize = 3;
const stepsPerFrame = 20;
const palette = [];
let ant;
let grid;

/**
 * Modulo implementation in javascript.
 * Because % returns a negative result if taken of a negative number as it is the remainder not the modulo.
 * https://stackoverflow.com/a/4467559/16724834
 *
 * @param {number} x The dividend.
 * @param {number} m The divisor.
 * @returns The positive remainder of the division.
 */
function mod(x, m) {
    return ((x % m) + m) % m;
}

class Grid {
    width = width / cellSize;
    height = height / cellSize;
    size = this.width * this.height;
    grid = Array(this.size).fill(0);
    center = floor(this.width / 2 + (this.height / 2) * this.width);
}

class Ant {
    x = floor(grid.width / 2);
    y = floor(grid.height) / 2;
    previousX;
    previousY;
    direction = 0;
    state = 0;
    color = color(0, 0, 0);
    moveMethods = [
        () => (this.x = (this.x + 1) % grid.width), // right
        () => (this.y = (this.y + 1) % grid.height), // down
        () => (this.x = mod(this.x - 1, grid.width)), // left
        () => (this.y = mod(this.y - 1, grid.height)), // up
    ];
    newGridState;

    update() {
        const gridIndex = floor(this.x + this.y * grid.width);
        const stateAtCurrentPosition = grid.grid[gridIndex];
        this.newGridState = (stateAtCurrentPosition + 1) % rules.length;
        grid.grid[gridIndex] = this.newGridState;
        this.move(stateAtCurrentPosition);
    }

    move(stateAtCurrentPosition) {
        this.direction = mod(this.direction + rules[stateAtCurrentPosition], 4);
        this.previousX = this.x;
        this.previousY = this.y;
        this.moveMethods[this.direction]();
    }

    draw() {
        fill(palette[this.newGridState]);
        square(this.previousX * cellSize, this.previousY * cellSize, cellSize);
        fill(this.color);
        square(this.x * cellSize, this.y * cellSize, cellSize);
    }
}

function setup() {
    createCanvas(600, 600);
    noStroke();
    colorMode(HSL, 1);
    const backgroundHue = 2 / 3;
    for (let i = 0; i < rules.length; i++) {
        const hue = (i / rules.length + backgroundHue) % 1;
        palette[i] = color(hue, 1, 0.5);
    }
    background(palette[0]);
    grid = new Grid();
    ant = new Ant();
}

function draw() {
    for (let i = 0; i < stepsPerFrame; i++) {
        ant.update();
        ant.draw();
    }
}
