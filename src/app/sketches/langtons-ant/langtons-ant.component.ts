import { floor } from "mathjs";
import p5 from "p5";

import { Component } from "@angular/core";

import { SketchComponent } from "src/app/sketch/sketch.component";

@Component({
    selector: "app-langtons-ant",
    standalone: true,
    imports: [SketchComponent],
    template: `<app-sketch [sketchFun]="createSketch" centeredHorizontally="true" />`,
})
export class LangtonsAntComponent {
    createSketch = (p: p5) => {
        // directions: 0 = right, 1 = down, 2 = left, 3 = up
        // turning: -1 = left, 0 = straight, 1 = right, 2 = turn around
        // rules: index = cell state, value = turn direction

        // TODO: Selectbox to change the ruleset.
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
        const cellSize = 4;
        const stepsPerFrame = 10;
        let ant: Ant;
        let grid: Grid;

        /**
         * Modulo implementation in javascript.
         * Because % returns a negative result if taken of a negative number as it is the remainder not the modulo.
         * https://stackoverflow.com/a/4467559/16724834
         *
         * @param x The dividend.
         * @param m The divisor.
         * @returns The positive remainder of the division.
         */
        function mod(x: number, m: number): number {
            return ((x % m) + m) % m;
        }

        class Grid {
            width = p.width / cellSize;
            height = p.height / cellSize;
            size = this.width * this.height;
            grid = Array(this.size).fill(0);
            center = floor(this.width / 2 + (this.height / 2) * this.width);
        }

        class Ant {
            x = floor(grid.width / 2);
            y = floor(grid.height) / 2;
            direction = 0;
            state = 0;
            color = p.color(0, 0, 0);
            moveMethods = [
                () => (this.x = (this.x + 1) % grid.width), // right
                () => (this.y = (this.y + 1) % grid.height), // down
                () => (this.x = mod(this.x - 1, grid.width)), // left
                () => (this.y = mod(this.y - 1, grid.height)), // up
            ];
            newGridState = this.state;

            step(): void {
                const gridIndex = floor(this.x + this.y * grid.width);
                const stateAtCurrentPosition = grid.grid[gridIndex];
                this.newGridState = (stateAtCurrentPosition + 1) % rules.turns.length;
                grid.grid[gridIndex] = this.newGridState;
                this.drawCell();
                this.move(stateAtCurrentPosition);
                this.drawAnt();
            }

            move(stateAtCurrentPosition: number): void {
                this.direction = mod(this.direction + rules.turns[stateAtCurrentPosition], 4);
                this.moveMethods[this.direction]();
            }

            drawCell(): void {
                p.fill(rules.gridColors[this.newGridState]);
                p.square(this.x * cellSize, this.y * cellSize, cellSize);
            }

            drawAnt(): void {
                p.fill(rules.antColor);
                p.square(this.x * cellSize, this.y * cellSize, cellSize);
            }
        }

        p.setup = () => {
            p.createCanvas(600, 600);
            p.noStroke();
            p.colorMode(p.HSL, 1);
            p.background(rules.gridColors[0]);
            grid = new Grid();
            ant = new Ant();
        };

        p.draw = () => {
            for (let i = 0; i < stepsPerFrame; i++) {
                ant.step();
            }
        };

        p.keyPressed = () => {
            if (p.key === " ") {
                if (p.isLooping()) {
                    p.noLoop();
                } else {
                    p.loop();
                }
            } else if (p.key === "s") {
                ant.step();
            }
        };
    };
}
