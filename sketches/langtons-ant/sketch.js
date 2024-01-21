// directions: 0 = right, 1 = down, 2 = left, 3 = up
// turning: -1 = left, 0 = straight, 1 = right, 2 = turn around
// rules: index = cell state, value = turn direction

const ruleCollection = {
    classic: {
        turns: [1, -1],
        gridColors: ["white", "black"],
        antColor: "red",
    },
    filled_triangle: {
        turns: [1, 1, -1, 1, -1, 1, 1],
        gridColors: ["black", "blue", "green", "darkred", "orange", "olive", "pink"],
        antColor: "white",
    },

    filled_square: {
        turns: [1, 1, -1, 1, 1],
        gridColors: ["black", "blue", "green", "darkred", "orange"],
        antColor: "white",
    },
    filled_corner: {
        turns: [1, 1, -1, 1, -1, -1],
        gridColors: ["black", "darkgreen", "darkred", "blue", "cyan", "olive"],
        antColor: "white",
    },
    highway_heaven: {
        turns: [-1, -1, -1, 1, 1, 1],
        gridColors: ["black", "darkgreen", "darkred", "blue", "cyan", "olive"],
        antColor: "white",
    },

    highway_square: {
        turns: [-1, 1, 1, 1, 1, 1, -1, -1, 1],
        gridColors: ["white", "purple", "darkgreen", "green", "blue", "orange", "olive", "cyan", "pink"],
        antColor: "red",
    },

    triangles: {
        turns: [1, 1, -1, -1, -1, 1, -1, -1, -1, 1, 1, 1],
        gridColors: [
            "black",
            "darkred",
            "green",
            "darkgreen",
            "blue",
            "orange",
            "purple",
            "cyan",
            "pink",
            "olive",
            "turquoise",
            "yellow",
        ],
        antColor: "white",
    },
    rectangle_symmetry: {
        turns: [1, -1, -1, 1],
        gridColors: ["white", "darkgreen", "darkred", "blue"],
        antColor: "black",
    },
    round_symmetry_1: {
        turns: [-1, -1, 1, 1],
        gridColors: ["white", "darkgreen", "darkred", "blue"],
        antColor: "black",
    },
    round_symmetry_2: {
        turns: [-1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1, 1],
        gridColors: [
            "white",
            "darkred",
            "green",
            "darkgreen",
            "blue",
            "orange",
            "purple",
            "cyan",
            "pink",
            "olive",
            "turquoise",
            "yellow",
        ],
        antColor: "black",
    },
    chaos: {
        turns: [1, -1, 1],
        gridColors: ["white", "violet", "cornflowerblue"],
        antColor: "black",
    },
    convoluted_highway: {
        turns: [-1, -1, 1, 1, 1, -1, 1, -1, 1, -1, -1, 1],
        gridColors: [
            "black",
            "darkred",
            "green",
            "darkgreen",
            "blue",
            "orange",
            "purple",
            "cyan",
            "pink",
            "olive",
            "turquoise",
            "yellow",
        ],
        antColor: "white",
    },
    more_highways: {
        turns: [-1, -1, 1, 1, -1, 1, -1, -1, -1, 1, -1, 1],
        gridColors: [
            "black",
            "darkred",
            "green",
            "darkgreen",
            "blue",
            "orange",
            "purple",
            "cyan",
            "pink",
            "olive",
            "turquoise",
            "yellow",
        ],
        antColor: "white",
    },
};
const rules = ruleCollection.more_highways;
const cellSize = 2;
const stepsPerFrame = 100;
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

    step() {
        const gridIndex = floor(this.x + this.y * grid.width);
        const stateAtCurrentPosition = grid.grid[gridIndex];
        this.newGridState = (stateAtCurrentPosition + 1) % rules.turns.length;
        grid.grid[gridIndex] = this.newGridState;
        this.drawCell();
        this.move(stateAtCurrentPosition);
        this.drawAnt();
    }

    move(stateAtCurrentPosition) {
        this.direction = mod(this.direction + rules.turns[stateAtCurrentPosition], 4);
        this.moveMethods[this.direction]();
    }

    drawCell() {
        fill(rules.gridColors[this.newGridState]);
        square(this.x * cellSize, this.y * cellSize, cellSize);
    }

    drawAnt() {
        fill(rules.antColor);
        square(this.x * cellSize, this.y * cellSize, cellSize);
    }
}

function setup() {
    createCanvas(600, 600);
    noStroke();
    colorMode(HSL, 1);
    background(rules.gridColors[0]);
    grid = new Grid();
    ant = new Ant();
}

function draw() {
    for (let i = 0; i < stepsPerFrame; i++) {
        ant.step();
    }
}

function keyPressed() {
    if (key === " ") {
        if (isLooping()) {
            noLoop();
        } else {
            loop();
        }
    } else if (key === "s") {
        ant.step();
    }
}
