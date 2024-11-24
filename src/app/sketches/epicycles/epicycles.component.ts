import * as math from "mathjs";
import p5 from "p5";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputSwitchModule } from "primeng/inputswitch";
import { SliderModule } from "primeng/slider";

import { Component, inject, viewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { RefreshService } from "src/app/refresh/refresh.service";
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

/*
TODO: Add color pickers for the colors of the line, circles and background.
*/

@Component({
    selector: "app-epicycles",
    standalone: true,
    imports: [SketchComponent, DropdownModule, FormsModule, InputSwitchModule, SliderModule, ButtonModule],
    template: `
        <app-sketch [sketchFun]="createSketch" />

        <div class="menu-overlay overlay-right">
            <div>
                <label for="shape-select">Select a shape</label>
                <p-dropdown
                    [(ngModel)]="selectedShape"
                    [options]="shapes"
                    (onChange)="refreshService.refreshButtonTriggered()"
                    inputId="shape-select"
                    optionLabel="label"
                    optionValue="filename"
                />
            </div>
            <div>
                <p-inputSwitch [(ngModel)]="showCircles" (onChange)="redrawIfNotRunning()" inputId="show-circles" />
                <label for="show-circles">Show the circles [c]</label>
            </div>
            <div>
                <p-inputSwitch [(ngModel)]="fadeLine" (onChange)="redrawIfNotRunning()" inputId="fade-line" />
                <label for="fade-line">Fade the line [f]</label>
            </div>
            <div>
                <label for="angular-velocity"
                    >Angular velocity: {{ velocities[velocityIndex].label }} rad/s [+/-]</label
                >
                <!-- [step]="1" is the default but the slider handle feels jumpy without it. -->
                <p-slider [(ngModel)]="velocityIndex" [max]="velocities.length - 1" [step]="1" />
            </div>
            <p-button
                [label]="isRunning ? 'Pause' : 'Play'"
                [rounded]="true"
                (onClick)="toggleRunning()"
                icon="pi {{ isRunning ? 'pi-pause' : 'pi-play' }}"
            />
        </div>
    `,
})
export class EpicyclesComponent {
    refreshService = inject(RefreshService);
    shapes = [
        { label: "Closed Hilbert Curve", filename: "closed_hilbert.txt" },
        { label: "H", filename: "H.txt" },
        { label: "Heart", filename: "heart.txt" },
        { label: "Star", filename: "star.txt" },
        { label: "Triangle", filename: "triangle.txt" },
    ];
    selectedShape = "heart.txt";
    showCircles = true;
    fadeLine = false;
    // Angular velocity in radians per second.
    velocityIndex = 5;
    velocities = [
        { label: "1/32", value: 1 / 32 },
        { label: "1/16", value: 1 / 16 },
        { label: "1/8", value: 1 / 8 },
        { label: "1/4", value: 1 / 4 },
        { label: "1/2", value: 1 / 2 },
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "4", value: 4 },
    ];
    sketchComponent = viewChild.required(SketchComponent);
    isRunning = true;

    toggleRunning(): void {
        this.isRunning = !this.isRunning;
        if (this.isRunning) {
            this.sketchComponent().sketch.loop();
        } else {
            this.sketchComponent().sketch.noLoop();
        }
    }

    redrawIfNotRunning(): void {
        if (!this.isRunning) {
            this.sketchComponent().sketch.redraw();
        }
    }

    createSketch = (p: p5): void => {
        const canvasWidth = 800;
        const canvasHeight = 800;
        // A number > 0 and <= 1 indicating how much of the width and height of the window the shape should occupy.
        const scaleFactor = 0.8;
        // Interpolate if points are farther apart than this.
        const maxDistance = 5;
        // Skip point if distance to previous point is smaller than this to avoid creating unnecessary points.
        const minDistance = 2;

        const path: math.Complex[] = [];
        let points: p5.Vector[] = [];
        let angles: number[] = [];
        const signal: { frequency: number; amplitude: number; phase: number }[] = [];
        let epicycleOrigin: p5.Vector;
        let currentAngle = 0;
        let maxDeltaTime: number;
        let lineColor: p5.Color;
        let backgroundColor: p5.Color;

        function loadPath(lines: string): void {
            const points = [];
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
                points.push(p.createVector(x, -y));
            }
            transformPath(points);
            points.forEach((p) => path.push(math.complex(p.x, p.y)));
        }

        function transformPath(points: p5.Vector[]): void {
            let maxX = -Infinity;
            let minX = Infinity;
            let maxY = -Infinity;
            let minY = Infinity;
            for (const point of points) {
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
            for (const p of points) {
                p.sub(center);
            }

            const width = maxX - minX;
            const height = maxY - minY;

            // Scale the shape to the desired size.
            const maxAllowedWidth = canvasWidth * scaleFactor;
            const maxAllowedHeight = canvasHeight * scaleFactor;
            let ratio;
            if (maxAllowedWidth <= maxAllowedHeight) {
                ratio = maxAllowedWidth / width;
            } else {
                ratio = maxAllowedHeight / height;
            }
            for (const p of points) {
                p.mult(ratio);
            }
        }

        /**
         * Discrete Fourier Transform
         * with scaled amplitudes and alternating positive and negative frequencies.
         */
        function dft(): void {
            const n = path.length;
            math.fft(path).forEach((value, index) =>
                signal.push({
                    frequency: index > n / 2 ? index - n : index,
                    amplitude: (math.abs(value) as unknown as number) / n,
                    phase: math.arg(value), // Phase in radians
                }),
            );
        }

        function setOrigin(): void {
            const offset = signal.shift()!;
            epicycleOrigin = p5.Vector.fromAngle(offset.phase, offset.amplitude).add(p.width / 2, p.height / 2);
        }

        /**
         * Sort by frequency so the frequencies are in the order -1, 1, -2, 2, -3, 3, etc.
         * I feel this results in the most aesthetically pleasing animation.
         */
        function sortEpicycles(): void {
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
        function trimArrays(): void {
            const limit = currentAngle - p.TWO_PI;
            for (let i = 0; i < angles.length; i++) {
                if (angles[i] > limit) {
                    angles = angles.slice(i);
                    points = points.slice(i);
                    break;
                }
            }
        }

        p.preload = (): void => {
            p.loadStrings(`epicycle-shapes/${this.selectedShape}`, loadPath);
        };

        p.setup = (): void => {
            p.createCanvas(canvasWidth, canvasHeight);
            p.noFill();
            maxDeltaTime = (1 / p.getTargetFrameRate()) * 1000 * 2;
            lineColor = p.color(255, 0, 255);
            backgroundColor = p.color(32);
            dft();
            setOrigin();
            sortEpicycles();

            // Add first point to simplify interpolation calculation.
            const firstPoint = getEpicyclesAtAngle(currentAngle, false);
            points.push(firstPoint);
            angles.push(currentAngle);
            if (!this.isRunning) {
                p.noLoop();
            }
        };

        p.draw = (): void => {
            p.background(backgroundColor);

            const previousAngle = currentAngle;
            // Conditional on p.isLooping() so p.redraw() doesn't advance the angle when paused.
            if (p.isLooping()) {
                // Limit dt because deltaTime increases even when isLooping() is false.
                const dt = p.min(p.deltaTime, maxDeltaTime) / 1000;
                // When saving a gif: Replace the following line with this:
                // currentAngle += TWO_PI / frames
                // With "frames" being the number of frames the gif is recording. More frames means slower animation.
                currentAngle += this.velocities[this.velocityIndex].value * dt;
            }
            const previousPoint = points[points.length - 1];
            const currentPoint = getEpicyclesAtAngle(currentAngle, this.showCircles);
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
            if (this.fadeLine) {
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

        p.keyPressed = (): void => {
            if (p.key === " ") {
                this.toggleRunning();
            } else if (p.key === "+") {
                this.velocityIndex = Math.min(this.velocities.length - 1, this.velocityIndex + 1);
            } else if (p.key == "-") {
                this.velocityIndex = Math.max(0, this.velocityIndex - 1);
            } else if (p.key === "f") {
                this.fadeLine = !this.fadeLine;
                if (!p.isLooping()) {
                    p.redraw();
                }
            } else if (p.key === "c") {
                this.showCircles = !this.showCircles;
                if (!p.isLooping()) {
                    p.redraw();
                }
            } else if (p.key === "d") {
                // debug info
                // eslint-disable-next-line no-console
                console.log(
                    `currentAngle: ${currentAngle}` +
                        `\npoints: ${points.length}` +
                        `\nangles: ${angles.length}` +
                        `\nspeed: ${this.velocities[this.velocityIndex].value}`,
                );
            }
        };
    };
}
