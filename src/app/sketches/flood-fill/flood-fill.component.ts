import p5 from "p5";

import { Component } from "@angular/core";

import { SketchComponent } from "src/app/sketch/sketch.component";

@Component({
    selector: "app-flood-fill",
    standalone: true,
    imports: [SketchComponent],
    template: `<app-sketch [sketchFun]="createSketch" />`,
})
export class FloodFillComponent {
    createSketch = (p: p5): void => {
        const backgroundColor = 255;
        let isFilling = false;

        p.setup = (): void => {
            p.createCanvas(600, 600, p.WEBGL);
            p.colorMode(p.HSB, 360, 100, 100, 100);
            p.pixelDensity(1);
            p.noLoop();
            p.noSmooth();
            // Translate to the top left corner because with WebGL the origin is at the center of the canvas.
            p.translate(-p.width / 2, -p.height / 2);
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

        function floodFill(x: number, y: number): void {
            if (isFilling) {
                return;
            }
            isFilling = true;
            const newColor = p.color(p.random(360), 100, 100, 100);
            const newRed = p.red(newColor);
            const newGreen = p.green(newColor);
            const newBlue = p.blue(newColor);
            // Set alpha to 255 because the pixels array uses RGBA with a maximum of 255.
            // Otherweise each successive fill darkens the image.
            const newAlpha = 255;

            let i = xyToPixelsIndex(x, y);
            p.loadPixels();
            const replaceRed = p.pixels[i];
            const replaceGreen = p.pixels[i + 1];
            const replaceBlue = p.pixels[i + 2];
            const replaceAlpha = p.pixels[i + 3];

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
                if (
                    replaceRed === p.pixels[i] &&
                    replaceGreen === p.pixels[i + 1] &&
                    replaceBlue === p.pixels[i + 2] &&
                    replaceAlpha === p.pixels[i + 3]
                ) {
                    p.pixels[i] = newRed;
                    p.pixels[i + 1] = newGreen;
                    p.pixels[i + 2] = newBlue;
                    p.pixels[i + 3] = newAlpha;

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
            isFilling = false;
        }
    };
}
