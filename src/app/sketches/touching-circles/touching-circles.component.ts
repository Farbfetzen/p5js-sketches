import p5 from "p5";

import { Component } from "@angular/core";

import { SketchComponent } from "src/app/sketch/sketch.component";

/*
Ideas:
- Fill the spaces between the big circles with small circles?
- Color!
*/

@Component({
    selector: "app-touching-circles",
    standalone: true,
    imports: [SketchComponent],
    template: `<app-sketch [sketchFun]="createSketch" />`,
})
export class TouchingCirclesComponent {
    createSketch = (p: p5): void => {
        let center: p5.Vector;
        let radius: number;

        p.setup = (): void => {
            p.createCanvas(1000, 1000);
            p.background(20);
            p.noFill();
            p.stroke(255);
            center = p.createVector(p.width / 2, p.height / 2);
            radius = 10;
            grow();
            while (isInBoundsOfCanvas()) {
                p.circle(center.x, center.y, radius * 2);
                grow();
            }
            p.noLoop();
        };

        function grow(): void {
            const distance = p.randomGaussian(30, 10);
            radius += distance;
            const centerOffset = p5.Vector.random2D().mult(distance);
            center.add(centerOffset);
        }

        function isInBoundsOfCanvas(): boolean {
            return (
                center.x + radius < p.width &&
                center.x - radius > 0 &&
                center.y + radius < p.height &&
                center.y - radius > 0
            );
        }
    };
}
