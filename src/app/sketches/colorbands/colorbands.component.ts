import p5 from "p5";

import { Component } from "@angular/core";

import { SketchComponent } from "src/app/sketch/sketch.component";

@Component({
    selector: "app-colorbands",
    standalone: true,
    imports: [SketchComponent],
    template: `<app-sketch [sketchFun]="createSketch" centeredHorizontally="true" />`,
})
export class ColorbandsComponent {
    createSketch = (p: p5): void => {
        p.setup = (): void => {
            p.createCanvas(400, 400);
            p.pixelDensity(1);
            p.noLoop();
            p.colorMode(p.HSL, 1);
        };

        p.draw = (): void => {
            const increment = 0.005;
            p.loadPixels();
            let yOffset = 0;
            for (let y = 0; y < p.height; y++) {
                let xOffset = 0;
                for (let x = 0; x < p.width; x++) {
                    const index = (x + y * p.width) * 4;
                    // Remove the first fractional value
                    // to get all possible colors from the normal distributed noise.
                    const hue = (p.noise(xOffset, yOffset) * 10) % 1;
                    const c = p.color(hue, 1, 0.5);
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
