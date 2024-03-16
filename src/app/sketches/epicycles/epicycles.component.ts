import * as math from "mathjs";
import p5 from "p5";

import { Component } from "@angular/core";

import { SketchComponent } from "src/app/sketch/sketch.component";

/*
References:
- <https://thecodingtrain.com/challenges/130-drawing-with-fourier-transform-and-epicycles>
- [Coding Challenge 125: Fourier Series](https://www.youtube.com/watch?v=Mm2eYfj0SgA)
- [Coding Challenge #130.1: Drawing with Fourier Transform and Epicycles](https://www.youtube.com/watch?v=MY4luNgGfms)
- [Coding Challenge #130: Fourier Transform User Drawing](https://www.youtube.com/watch?v=n9nfTxp_APM)
- [Coding Challenge #130: Fourier Transform Drawing with Complex Number Input](https://www.youtube.com/watch?v=7_vKzcgpfvU)
- ["Epicycles, complex Fourier series and Homer Simpson's orbit"](https://www.youtube.com/watch?v=qS4H6PEcCCA) by [Mathologer](https://www.youtube.com/@Mathologer)
*/

@Component({
    selector: "app-epicycles",
    standalone: true,
    imports: [SketchComponent],
    template: `<app-sketch [sketchFun]="createSketch" centeredHorizontally="true" />`,
})
export class EpicyclesComponent {
    createSketch = (p: p5) => {
        // TODO: Find out why closed_hilbert loads so slowly and make it faster.
        // TODO: Add a selectbox for selecting a shape.
        // TODO: Add buttons that to the same as the keybindings.

        const filename = "assets/epicycle-shapes/heart.txt";
        let fadeLine = false;
        let showCircles = true;
        const canvasWidth = 800;
        const canvasHeight = 800;
        // A number > 0 and <= 1 indicating how much of the width and height of the window the shape should occupy.
        const scaleFactor = 0.8;
        // Angular velocity in radians per second.
        let angularVelocity = 1;
        const minAngularVelocity = 1 / 32;
        const maxAngularVelocity = 4;
        // Interpolate if points are farther apart than this.
        const maxDistance = 5;
        // Skip point if distance to previous point is smaller than this to avoid creating unnecessary points.
        const minDistance = 2;

        const path: p5.Vector[] = [];
        let points: p5.Vector[] = [];
        let angles: number[] = [];
        const signal: { frequency: number; amplitude: number; phase: number }[] = [];
        let epicycleOrigin: p5.Vector;
        let currentAngle = 0;
        let maxDeltaTime: number;
        let lineColor: p5.Color;
        let backgroundColor: p5.Color;

        function loadPath(lines: string): void {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (!line || line.startsWith("//")) {
                    continue;
                }
                const point = line.split(" ");
                const x = Number(point[0]);
                const y = Number(point[1]);
                if (isNaN(x) || isNaN(y)) {
                    throw new Error("Error in line " + i + " while trying to convert strings to numbers: " + line);
                }
                // Negate the y value because y increases downwards on the canvas.
                path.push(p.createVector(x, -y));
            }
        }

        function transformPath(): void {
            let maxX = -Infinity;
            let minX = Infinity;
            let maxY = -Infinity;
            let minY = Infinity;
            for (const point of path) {
                if (point.x > maxX) {
                    maxX = point.x;
                } else if (point.x < minX) {
                    minX = point.x;
                }
                if (point.y > maxY) {
                    maxY = point.y;
                } else if (point.y < minY) {
                    minY = point.y;
                }
            }

            // Center the shape around (0, 0).
            const center = p.createVector((maxX + minX) / 2, (maxY + minY) / 2);
            for (const p of path) {
                p.sub(center);
            }

            const pathWidth = maxX - minX;
            const pathHeight = maxY - minY;

            // Scale the shape to the desired size.
            const maxAllowedWidth = canvasWidth * scaleFactor;
            const maxAllowedHeight = canvasHeight * scaleFactor;
            let ratio;
            if (maxAllowedWidth <= maxAllowedHeight) {
                ratio = maxAllowedWidth / pathWidth;
            } else {
                ratio = maxAllowedHeight / pathHeight;
            }
            for (const p of path) {
                p.mult(ratio);
            }
        }

        /**
         * Discrete Fourier Transform
         *
         * Algorithm taken from Wikipedia: https://en.wikipedia.org/wiki/Discrete_Fourier_transform
         * X_k = SUM(n=0, N-1)(x_n * e^(-(i * 2 * PI * k * n) / N))
         */
        function dft() {
            const x = path.map((p) => math.complex(p.x, p.y));
            const N = path.length;
            const minusI2Pi = math.chain(math.i).multiply(p.TWO_PI).unaryMinus().done();
            for (let k = 0; k < N; k++) {
                let X_k = math.complex();
                for (let n = 0; n < N; n++) {
                    // X_k = X_k.add(x[n].mul(math.exp(minusI2Pi.mul((k * n) / N))));
                    X_k = math.add(
                        X_k,
                        math.multiply(x[n], math.exp(math.multiply(minusI2Pi, (k * n) / N))),
                    ) as math.Complex;
                }
                const frequency = k > N / 2 ? k - N : k;
                //@ts-expect-error works anyway
                const amplitude = math.abs(X_k) / N; // radius
                const phase = math.arg(X_k);
                signal.push({ frequency, amplitude, phase });
            }
        }

        function setOrigin() {
            const offset = signal.shift()!;
            epicycleOrigin = p5.Vector.fromAngle(offset.phase, offset.amplitude).add(p.width / 2, p.height / 2);
        }

        /**
         * Sort by frequency so the frequencies are in the order -1, 1, -2, 2, -3, 3, etc.
         * I feel this results in the most aesthetically pleasing animation.
         */
        function sortEpicycles() {
            signal.sort((a, b) => {
                const absA = p.abs(a.frequency);
                const absB = p.abs(b.frequency);
                return absA !== absB ? absA - absB : a.frequency - b.frequency;
            });
        }

        function interpolate(
            point1: p5.Vector,
            angle1: number,
            point2: p5.Vector,
            angle2: number,
        ): [p5.Vector[], number[]] {
            const meanAngle = (angle1 + angle2) / 2;
            const meanPoint = getEpicyclesAtAngle(meanAngle, false);
            const resultPoints = [];
            const resultAngles = [];
            if (point1.dist(meanPoint) > maxDistance) {
                const [interpolatedPoints, interpolatedAngles] = interpolate(point1, angle1, meanPoint, meanAngle);
                resultPoints.push(...interpolatedPoints);
                resultAngles.push(...interpolatedAngles);
            }
            resultPoints.push(meanPoint);
            resultAngles.push(meanAngle);
            if (meanPoint.dist(point2) > maxDistance) {
                const [interpolatedPoints, interpolatedAngles] = interpolate(meanPoint, meanAngle, point2, angle2);
                resultPoints.push(...interpolatedPoints);
                resultAngles.push(...interpolatedAngles);
            }
            return [resultPoints, resultAngles];
        }

        function getEpicyclesAtAngle(angle: number, showCircles: boolean): p5.Vector {
            let x = epicycleOrigin.x;
            let y = epicycleOrigin.y;
            p.strokeWeight(1);
            for (const s of signal) {
                const previousx = x;
                const previousY = y;
                const phi = s.frequency * angle + s.phase;
                x += s.amplitude * p.cos(phi);
                y += s.amplitude * p.sin(phi);

                if (showCircles && s.amplitude >= 1) {
                    p.stroke(128);
                    p.ellipse(previousx, previousY, s.amplitude + s.amplitude);
                    p.line(previousx, previousY, x, y);
                }
            }
            return p.createVector(x, y);
        }

        /**
         * Keep the points and angles arrays short by removing points that are more than TWO_PI radians behind.
         */
        function trimArrays() {
            const limit = currentAngle - p.TWO_PI;
            for (let i = 0; i < angles.length; i++) {
                if (angles[i] > limit) {
                    angles = angles.slice(i);
                    points = points.slice(i);
                    break;
                }
            }
        }

        p.preload = () => {
            p.loadStrings(filename, loadPath);
        };

        p.setup = () => {
            p.createCanvas(canvasWidth, canvasHeight);
            p.noFill();
            maxDeltaTime = (1 / p.getTargetFrameRate()) * 1000 * 2;
            lineColor = p.color(255, 0, 255);
            backgroundColor = p.color(32);
            transformPath();
            dft();
            setOrigin();
            sortEpicycles();

            // Add first point to simplify interpolation calculation.
            const firstPoint = getEpicyclesAtAngle(currentAngle, false);
            points.push(firstPoint);
            angles.push(currentAngle);
        };

        p.draw = () => {
            // Limit dt because deltaTime increases even when isLooping() is false.
            const dt = p.min(p.deltaTime, maxDeltaTime) / 1000;

            p.background(backgroundColor);

            const previousAngle = currentAngle;
            // When saving a gif: Replace the following line with this:
            // currentAngle += TWO_PI / frames
            // With "frames" being the number of frames the gif is recording. More frames means slower animation.
            currentAngle += angularVelocity * dt;
            const previousPoint = points[points.length - 1];
            const currentPoint = getEpicyclesAtAngle(currentAngle, showCircles);
            const distance = previousPoint.dist(currentPoint);
            if (distance > maxDistance) {
                const [interpolatedPoints, interpolatedAngles] = interpolate(
                    previousPoint,
                    previousAngle,
                    currentPoint,
                    currentAngle,
                );
                points.push(...interpolatedPoints);
                angles.push(...interpolatedAngles);
            }
            if (distance > minDistance) {
                points.push(currentPoint);
                angles.push(currentAngle);
            }

            trimArrays();

            p.strokeWeight(2);
            if (fadeLine) {
                for (let i = 0; i < points.length - 1; i++) {
                    const angle = angles[i];
                    const from = points[i];
                    const to = points[i + 1];
                    p.stroke(p.lerpColor(lineColor, backgroundColor, (currentAngle - angle) / p.TWO_PI));
                    p.line(from.x, from.y, to.x, to.y);
                }
            } else {
                p.stroke(lineColor);
                p.beginShape();
                for (const point of points) {
                    p.vertex(point.x, point.y);
                }
                p.endShape();
            }
        };

        p.keyPressed = () => {
            if (p.key === " ") {
                if (p.isLooping()) {
                    p.noLoop();
                } else {
                    p.loop();
                }
            } else if (p.key === "+" && angularVelocity < maxAngularVelocity) {
                angularVelocity *= 2;
            } else if (p.key == "-" && angularVelocity > minAngularVelocity) {
                angularVelocity /= 2;
            } else if (p.key === "f") {
                fadeLine = !fadeLine;
            } else if (p.key === "c") {
                showCircles = !showCircles;
            } else if (p.key === "d") {
                // debug info
                console.log(
                    `currentAngle: ${currentAngle}` +
                        `\npoints: ${points.length}` +
                        `\nangles: ${angles.length}` +
                        `\nspeed: ${angularVelocity}`,
                );
            }
        };
    };
}
