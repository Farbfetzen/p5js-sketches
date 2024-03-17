import p5 from "p5";

import { Component } from "@angular/core";

import { SketchComponent } from "src/app/sketch/sketch.component";

@Component({
    selector: "app-noise2d-hsl",
    standalone: true,
    imports: [SketchComponent],
    template: `<app-sketch [sketchFun]="createSketch" centeredHorizontally="true" />`,
})
export class Noise2dHslComponent {
    createSketch = (p: p5): void => {
        const increment = 0.01;

        p.setup = (): void => {
            p.createCanvas(400, 400);
            p.pixelDensity(1);
            p.colorMode(p.HSL, 1);
            p.noLoop();
            p.noiseSeed(p.random(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));
        };

        p.draw = (): void => {
            p.loadPixels();
            let yOffset = 0;
            for (let y = 0; y < p.height; y++) {
                let xOffset = 0;
                for (let x = 0; x < p.width; x++) {
                    const hue = (p.noise(xOffset, yOffset) * 2) % 1;
                    const c = p.color(hue, 0.8, 0.5);
                    const index = (x + y * p.width) * 4;
                    p.pixels[index] = p.red(c);
                    p.pixels[index + 1] = p.green(c);
                    p.pixels[index + 2] = p.blue(c);
                    p.pixels[index + 3] = 255;
                    xOffset += increment;
                }
                yOffset += increment;
            }
            p.updatePixels();
        };
    };
}
