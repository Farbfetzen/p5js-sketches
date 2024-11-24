import p5 from "p5";
import { SliderModule } from "primeng/slider";

import { Component, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { SketchComponent } from "src/app/sketch/sketch.component";
import { cutCorners } from "src/app/util/corner-cutting";

/*
TODO:
- Sliders for
    - numberOfHorizontalPolygons
    - numberOfVerticalPolygons
    - standard deviations (or just use p.random()?)
    - margins?
    - Only redraw when necessary.
*/

@Component({
    selector: "app-corner-cutting",
    standalone: true,
    imports: [SketchComponent, FormsModule, SliderModule],
    template: `
        <app-sketch [sketchFun]="createSketch" />

        <div class="menu-overlay overlay-right">
            <div>
                <label for="ratio">Ratio: {{ ratio }}</label>
                <p-slider id="ratio" [(ngModel)]="ratio" [max]="1.5" [min]="-1" [step]="0.1" />
            </div>
            <div>
                <label for="iterations">Iterations: {{ iterations }}</label>
                <p-slider id="iterations" [(ngModel)]="iterations" [max]="5" [min]="0" />
            </div>
        </div>
    `,
})
export class CornerCuttingComponent {
    @ViewChild(SketchComponent) sketchComponent!: SketchComponent;
    ratio = 0.2;
    iterations = 3;

    createSketch = (p: p5): void => {
        class Polygon {
            constructor(
                public readonly vertices: p5.Vector[],
                public readonly color: p5.Color,
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

        p.setup = (): void => {
            const size = p.windowHeight - 2 * canvasMargin;
            p.createCanvas(size, size);
            p.strokeWeight(2);
            p.strokeJoin(p.ROUND);
            createPolygons();
        };

        p.draw = (): void => {
            p.background(240);
            polygons
                .map((p) => new Polygon(cutCorners(p.vertices, this.ratio, this.iterations), p.color))
                .forEach((p) => p.draw());
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
