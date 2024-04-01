import p5 from "p5";

import { Component } from "@angular/core";

import { SketchComponent } from "src/app/sketch/sketch.component";

@Component({
    selector: "app-flood-fill",
    standalone: true,
    imports: [SketchComponent],
    template: `<app-sketch [sketchFun]="createSketch" centeredHorizontally="true" />`,
})
export class FloodFillComponent {
    createSketch = (p: p5): void => {
        let backgroundColor: number;
        const epsilon = 0.1;
        let isFilling = false;

        p.setup = (): void => {
            p.createCanvas(600, 600);
            p.colorMode(p.HSB, 360, 100, 100, 100);
            p.pixelDensity(1);
            p.noLoop();
            p.noSmooth();
            backgroundColor = 255;
            prepareShapes();
        };

        function prepareShapes(): void {
            p.background(backgroundColor);
            p.strokeWeight(1);
            p.noFill();
            for (let i = 0; i < 20; i++) {
                const x = p.random(p.width);
                const y = p.random(p.height);
                if (p.random() < 0.5) {
                    p.circle(x, y, p.random(10, p.width / 2));
                } else {
                    p.rect(x, y, p.random(10, p.width / 2), p.random(10, p.height / 2));
                }
            }
        }

        p.mousePressed = (): boolean => {
            if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                floodFill(p.int(p.mouseX), p.int(p.mouseY));
            }
            return false;
        };

        function xyToPixelsIndex(x: number, y: number): number {
            return p.floor(x + y * p.width) * 4;
        }

        // TODO: Remove console.log
        function floodFill(x: number, y: number): void {
            if (isFilling) {
                return;
            }
            isFilling = true;
            const newColor = p.color(p.random(360), 100, 100, 100);
            const newRed = p.red(newColor);
            const newGreen = p.green(newColor);
            const newBlue = p.blue(newColor);
            // Set alpha to 255 because p.alpha(newColor) does not output 255 for the maximum alpha.
            // This seems inconsistent with the values in the pixels array because there 255 is the max alpha.
            const newAlpha = 255;
            // console.log(`new: ${newRed}, ${newGreen}, ${newBlue}, ${newAlpha}`);

            let i = xyToPixelsIndex(x, y);
            p.loadPixels();
            const replaceRed = p.pixels[i];
            const replaceGreen = p.pixels[i + 1];
            const replaceBlue = p.pixels[i + 2];
            const replaceAlpha = p.pixels[i + 3];
            // console.log(`replace: ${replaceRed}, ${replaceGreen}, ${replaceBlue}, ${replaceAlpha}`);

            if (
                newRed === replaceRed &&
                newGreen === replaceGreen &&
                newBlue === replaceBlue &&
                newAlpha === replaceAlpha
            ) {
                return;
            }

            const frontier = [[x, y]];
            while (frontier.length) {
                const [currentX, currentY] = frontier.pop()!;
                i = xyToPixelsIndex(currentX, currentY);
                const currentRed = p.pixels[i];
                const currentGreen = p.pixels[i + 1];
                const currentBlue = p.pixels[i + 2];
                const currentAlpha = p.pixels[i + 3];

                // console.log(`current: ${currentRed}, ${currentGreen}, ${currentBlue}, ${currentAlpha}`);
                if (
                    p.abs(currentRed - replaceRed) < epsilon &&
                    p.abs(currentGreen - replaceGreen) < epsilon &&
                    p.abs(currentBlue - replaceBlue) < epsilon &&
                    p.abs(currentAlpha - replaceAlpha) < epsilon
                ) {
                    p.pixels[i] = newRed;
                    p.pixels[i + 1] = newGreen;
                    p.pixels[i + 2] = newBlue;
                    p.pixels[i + 3] = newAlpha;
                    // console.log(p.pixels.slice(i, i + 4));

                    if (currentX > 0) {
                        frontier.push([currentX - 1, currentY]);
                    }
                    if (currentX < p.width - 1) {
                        frontier.push([currentX + 1, currentY]);
                    }
                    if (currentY > 0) {
                        frontier.push([currentX, currentY - 1]);
                    }
                    if (currentY < p.height - 1) {
                        frontier.push([currentX, currentY + 1]);
                    }
                }
            }
            p.updatePixels();
            console.log("done");
            isFilling = false;
        }
    };
}
