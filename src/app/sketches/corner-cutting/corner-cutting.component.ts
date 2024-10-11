import p5 from "p5";

import { Component } from "@angular/core";

import { SketchComponent } from "src/app/sketch/sketch.component";
import { cutCorners } from "src/app/util/corner-cutting";

/*
TODO:
- Sliders for
    - ratio (between 0 and 2 inclusive)
    - iterations (between 0 and 5 inclusive)
    - numberOfHorizontalPolygons
    - numberOfVerticalPolygons
    - standard deviations (or just use p.random()?)
    - margins?
*/

@Component({
    selector: "app-corner-cutting",
    standalone: true,
    imports: [SketchComponent],
    template: `<app-sketch [sketchFun]="createSketch" />`,
})
export class CornerCuttingComponent {
    createSketch = (p: p5): void => {
        class Polygon {
            constructor(
                public vertices: p5.Vector[],
                private readonly color: p5.Color,
            ) {}

            draw(): void {
                p.fill(this.color);
                p.beginShape();
                for (const v of this.vertices) {
                    p.vertex(v.x, v.y);
                }
                p.endShape(p.CLOSE);
            }
        }

        const canvasMargin = 50;
        const gridMargin = 20;
        const numberOfHorizontalPolygons = 10;
        const numberOfVerticalPolygons = 10;
        const polygons: Polygon[] = [];
        const cuttingRatio = 0.25;
        const cuttingIterations = 3;

        p.setup = (): void => {
            const size = p.windowHeight - 2 * canvasMargin;
            p.createCanvas(size, size);
            p.noLoop();
            p.strokeWeight(2);
            p.strokeJoin(p.ROUND);
        };

        p.draw = (): void => {
            p.background(240);
            createPolygons();
            for (const polygon of polygons) {
                polygon.vertices = cutCorners(polygon.vertices, cuttingRatio, cuttingIterations);
                polygon.draw();
            }
        };

        function createPolygons(): void {
            const grid = createGrid();
            for (let y = 0; y < numberOfVerticalPolygons; y++) {
                for (let x = 0; x < numberOfHorizontalPolygons; x++) {
                    const vertices = [grid[y][x], grid[y][x + 1], grid[y + 1][x + 1], grid[y + 1][x]];
                    const color = p.color(p.random(0, 256), p.random(0, 256), p.random(0, 256));
                    polygons.push(new Polygon(vertices, color));
                }
            }
        }

        function createGrid(): p5.Vector[][] {
            const grid: p5.Vector[][] = [];
            const xDiff = (p.width - gridMargin * 2) / numberOfHorizontalPolygons;
            const yDiff = (p.height - gridMargin * 2) / numberOfVerticalPolygons;
            const xSd = xDiff / 5;
            const ySd = yDiff / 5;
            for (let y = 0; y <= numberOfVerticalPolygons; y++) {
                const row: p5.Vector[] = [];
                for (let x = 0; x <= numberOfHorizontalPolygons; x++) {
                    const vector = p.createVector(x * xDiff + gridMargin, y * yDiff + gridMargin);
                    if (x > 0 && x < numberOfHorizontalPolygons) {
                        vector.x += p.randomGaussian(0, xSd);
                    }
                    if (y > 0 && y < numberOfVerticalPolygons) {
                        vector.y += p.randomGaussian(0, ySd);
                    }
                    row.push(vector);
                }
                grid.push(row);
            }
            return grid;
        }
    };
}
