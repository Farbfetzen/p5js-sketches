import p5 from "p5";

import { Component } from "@angular/core";

import { SketchComponent } from "src/app/sketch/sketch.component";

@Component({
    selector: "app-falling-sand",
    standalone: true,
    imports: [SketchComponent],
    template: `<app-sketch [sketchFun]="createSketch" centeredHorizontally="true" />`,
})
export class FallingSandComponent {
    createSketch = (p: p5) => {
        const cellSize = 5;
        const creationRadius = 10; // in grid units
        const newGrainsPerFrame = 100;
        let grid: Grid;
        let currentHue: number;

        class Grid {
            width;
            height;
            size;
            grid;

            constructor() {
                this.width = p.width / cellSize;
                this.height = p.height / cellSize;
                this.size = this.width * this.height;
                this.grid = Array(this.size).fill(null);
            }

            xyToIndex(x: number, y: number) {
                return p.floor(x + y * this.width);
            }

            setAt(x: number, y: number, value: number | null) {
                if (this.isInBounds(x, y)) {
                    this.grid[this.xyToIndex(x, y)] = value;
                }
            }

            getAt(x: number, y: number) {
                if (this.isInBounds(x, y)) {
                    return this.grid[this.xyToIndex(x, y)];
                }
            }

            isInBounds(x: number, y: number) {
                return x >= 0 && x < this.width && y >= 0 && y < this.height;
            }
        }

        p.setup = () => {
            p.createCanvas(600, 600);
            p.noStroke();
            p.colorMode(p.HSL, 100);
            grid = new Grid();
        };

        p.draw = () => {
            p.background(0);

            if (p.mouseIsPressed) {
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
                        p.fill(p.color(cellHue, 100, 50));
                        p.square(newX * cellSize, newY * cellSize, cellSize);
                    }
                }
            }
        };

        function createSand() {
            for (let i = 0; i < newGrainsPerFrame; i++) {
                const v = p5.Vector.random2D()
                    .setMag(p.random(creationRadius * cellSize))
                    .add(p.mouseX, p.mouseY);
                const cellX = p.floor(v.x / cellSize);
                const cellY = p.floor(v.y / cellSize);
                if (!grid.getAt(cellX, cellY)) {
                    grid.setAt(cellX, cellY, currentHue);
                }
            }
        }

        p.mousePressed = () => {
            currentHue = p.random(100);
        };

        function getNextParticlePosition(x: number, y: number) {
            const below = y + 1;
            if (below === grid.height) {
                return [x, y];
            }

            if (grid.getAt(x, below) === null) {
                return [x, below];
            }

            const left = x - 1;
            const right = x + 1;
            const bottomLeftIsAvailable = left > -1 && grid.getAt(left, below) === null;
            const bottomRightIsAvailable = right < grid.width && grid.getAt(right, below) === null;
            if (bottomLeftIsAvailable) {
                if (bottomRightIsAvailable) {
                    return [p.random([left, right]), below];
                } else {
                    return [left, below];
                }
            } else if (bottomRightIsAvailable) {
                return [right, below];
            }

            return [x, y];
        }
    };
}
