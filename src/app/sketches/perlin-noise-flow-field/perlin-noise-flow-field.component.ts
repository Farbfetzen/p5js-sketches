import p5 from "p5";

import { Component } from "@angular/core";

import { SketchComponent } from "src/app/sketch/sketch.component";
import { Particle } from "src/app/sketches/perlin-noise-flow-field/particle";

@Component({
    selector: "app-perlin-noise-flow-field",
    standalone: true,
    imports: [SketchComponent],
    template: `<app-sketch [sketchFun]="createSketch" />`,
})
export class PerlinNoiseFlowFieldComponent {
    createSketch = (p: p5): void => {
        const xyOffsetPerPixel = 0.01;
        let zOffset = 0;
        const zIncrementPerFrame = 0.01;
        const particles: Particle[] = [];
        const wrapAroundEdges = false;
        // Multiply the noise by noiseWidth to widen it and thus the angles.
        // Otherwise, the force mostly points to the right (PI radians).
        const noiseWidth = 4;

        p.setup = (): void => {
            p.createCanvas(600, 600);
            p.strokeWeight(2);
            p.strokeCap(p.SQUARE);
            p.colorMode(p.HSL, p.TWO_PI, 1, 1, 1);
            p.background(0.1);
            for (let i = 0; i < 5000; i++) {
                particles[i] = new Particle(p, xyOffsetPerPixel, noiseWidth, wrapAroundEdges);
            }
        };

        p.draw = (): void => {
            zOffset += zIncrementPerFrame;
            for (const particle of particles) {
                particle.changeDirection(zOffset);
                particle.move();
                particle.show();
            }
            if (p.frameCount >= 600) {
                p.noLoop();
            }
        };
    };
}
