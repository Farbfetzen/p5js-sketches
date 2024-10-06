import p5 from "p5";

import { Component } from "@angular/core";

import { SketchComponent } from "src/app/sketch/sketch.component";

@Component({
    selector: "app-noise1d",
    standalone: true,
    imports: [SketchComponent],
    template: `<app-sketch [sketchFun]="createSketch" />`,
})
export class Noise1dComponent {
    createSketch = (p: p5): void => {
        const increment = 0.02;
        let start = 0;

        p.setup = (): void => {
            p.createCanvas(400, 400);
            p.stroke(0);
            p.noFill();
        };

        p.draw = (): void => {
            p.background(240);
            let xOffset = start;
            p.beginShape();
            for (let x = 0; x < p.width; x++) {
                const y = p.noise(xOffset) * p.height;
                xOffset += increment;
                p.vertex(x, y);
            }
            p.endShape();
            start += increment;
        };
    };
}
