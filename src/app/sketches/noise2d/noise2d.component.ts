import p5 from "p5";

import { Component } from "@angular/core";

import { SketchComponent } from "src/app/sketch/sketch.component";

@Component({
    selector: "app-noise2d",
    standalone: true,
    imports: [SketchComponent],
    template: `<app-sketch [sketchFun]="createSketch" centeredHorizontally="true" />`,
})
export class Noise2dComponent {
    createSketch = (p: p5): void => {
        const greenOffset = 10;
        const blueOffset = greenOffset * 2;
        const increment = 0.01;

        p.setup = (): void => {
            p.createCanvas(400, 400);
            p.pixelDensity(1);
            p.noLoop();
        };

        p.draw = (): void => {
            p.loadPixels();
            let yOffset = 0;
            for (let y = 0; y < p.height; y++) {
                let xOffset = 0;
                for (let x = 0; x < p.width; x++) {
                    const index = (x + y * p.width) * 4;
                    let n = p.noise(xOffset, yOffset) * 255;
                    // The results from noise() are concentrated around 0.5 and rarely go beyond 0.2 or 0.8.
                    // This transforms the value so the colors become more vibrant.
                    n = p.map(n, 50, 200, 0, 255);
                    n = p.constrain(n, 0, 255);
                    p.pixels[index] = n;
                    p.pixels[index + 1] = p.noise(xOffset + greenOffset, yOffset + greenOffset) * 255;
                    p.pixels[index + 2] = p.noise(xOffset + blueOffset, yOffset + blueOffset) * 255;
                    p.pixels[index + 3] = 255;
                    xOffset += increment;
                }
                yOffset += increment;
            }
            p.updatePixels();
        };
    };
}
