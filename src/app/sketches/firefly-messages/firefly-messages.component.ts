import p5 from "p5";

import { Component } from "@angular/core";

import { SketchComponent } from "src/app/sketch/sketch.component";

@Component({
    selector: "app-firefly-messages",
    standalone: true,
    imports: [SketchComponent],
    template: `<app-sketch [sketchFun]="createSketch" centeredHorizontally="true" />`,
})
export class FireflyMessagesComponent {
    createSketch = (p: p5): void => {
        // Goal: Have particles forming words one after the other.
        // Like the helpful fireflies from Abe's Oddysee.

        const message = "these lights will guide you";
        const recordGif = false;
        const numberOfFlies = 1000;
        const maxSpeed = 10;
        const maxTargetRadius = 200;
        const targetEllipseFactor = 2;
        const flySize = 5;
        const glowSize = flySize * 3;
        const showTargets = false;
        const maxTextSize = 200;
        const textMargin = 50;
        // Count frames instead of using deltaTime because saveGif() does not work with the timing.
        // All frame counts assume 60 fps.
        const initialDelay = 120;
        const wordDuration = 90;
        const spaceDuration = 30;
        const fireflies: Particle[] = [];
        let recordingFrameCount: number;
        let recordingDelay: number;
        let center: p5.Vector;
        let randomMode = true;
        const targetsPerWord: p5.Vector[][] = [];
        let wordIndex = 0;
        let frameCountForNextStep = initialDelay;

        class Particle {
            position = p.createVector(p.random(p.width), p.random(p.height));
            velocity = p5.Vector.random2D();
            target!: p5.Vector;
            hue = p.random(30, 70);
            flyColor = p.color(this.hue, 100, 50, 50);
            glowColor = p.color(this.hue, 100, 50, 25);

            constructor() {
                this.randomTarget();
            }

            randomTarget(): void {
                this.target = p5.Vector.random2D().setMag(p.random(maxTargetRadius));
                this.target.x *= targetEllipseFactor;
                this.target.add(center);
            }

            update(): void {
                const difference = p5.Vector.sub(this.target, this.position);
                const distance = difference.mag();
                // Set the distance cutoff to 1 so the flies keep vibrating a little near their targets.
                if (distance > 1) {
                    difference.setMag(randomMode ? 1 : 1.1);
                    this.velocity.add(difference);
                    this.velocity.limit(randomMode ? maxSpeed : p.sqrt(distance));
                }
                this.position.add(this.velocity);

                // Move the target around to achieve erratic flight paths instead of orbits.
                if (randomMode && p.random() < 0.05) {
                    this.randomTarget();
                }
            }

            drawFly(): void {
                p.fill(this.flyColor);
                p.circle(this.position.x, this.position.y, flySize);
            }

            drawGlow(): void {
                p.fill(this.glowColor);
                p.circle(this.position.x, this.position.y, glowSize);
            }
        }

        p.setup = (): void => {
            p.createCanvas(1080, 608); // 16:9 aspect ratio
            center = p.createVector(p.width / 2, p.height / 2);
            p.colorMode(p.HSL, 360, 100, 100, 100);
            p.noStroke();
            p.rectMode(p.CENTER);
            const words = message.trim().split(/\s/);
            prepareTargets(words);
            recordingFrameCount = p.int(
                initialDelay + wordDuration * words.length + spaceDuration * (words.length - 1),
            );
            recordingDelay = p.int(initialDelay / 2);
            for (let i = 0; i < numberOfFlies; i++) {
                fireflies.push(new Particle());
            }
        };

        p.draw = (): void => {
            if (p.frameCount === frameCountForNextStep) {
                step();
            }

            if (recordGif && p.frameCount == recordingDelay) {
                p.saveGif("firefly-messages", recordingFrameCount, { units: "frames" });
            }

            p.background(240, 100, 6);
            for (const fly of fireflies) {
                fly.update();
                if (showTargets) {
                    p.fill(290, 100, 50);
                    p.square(fly.target.x, fly.target.y, flySize);
                }
                fly.drawGlow();
            }
            // It looks better if the flies and teir glow are drawn in separate loops.
            for (const fly of fireflies) {
                fly.drawFly();
            }
        };

        function step(): void {
            randomMode = !randomMode;
            if (randomMode) {
                for (const fly of fireflies) {
                    fly.randomTarget();
                }
                if (wordIndex >= targetsPerWord.length) {
                    wordIndex = 0;
                    frameCountForNextStep += initialDelay;
                } else {
                    frameCountForNextStep += spaceDuration;
                }
            } else {
                for (let i = 0; i < numberOfFlies; i++) {
                    const target = targetsPerWord[wordIndex][i];
                    fireflies[i].target.set(target.x, target.y);
                }
                wordIndex++;
                frameCountForNextStep += wordDuration;
            }
        }

        function prepareTargets(words: string[]): void {
            const textColor = p.color(360, 100, 100);
            p.fill(textColor);
            const textColorRedChannel = p.int(p.red(textColor));
            p.textAlign(p.CENTER, p.CENTER);
            for (const word of words) {
                let currentTextSize = maxTextSize;
                p.textSize(currentTextSize);
                // Shrink text if the word is too wide.
                while (p.textWidth(word) > p.width - textMargin * 2) {
                    currentTextSize--;
                    p.textSize(currentTextSize);
                }
                p.text(word, center.x, center.y);

                const coordinates = [];
                p.loadPixels();
                for (let i = 0; i < p.pixels.length / 4; i++) {
                    if (p.pixels[i * 4] === textColorRedChannel) {
                        const x = i % p.width;
                        const y = p.int(i / p.width);
                        coordinates.push(p.createVector(x, y));
                    }
                }
                const targets = [];
                for (let i = 0; i < numberOfFlies; i++) {
                    targets.push(coordinates[p.int(p.random(coordinates.length))]);
                }
                targetsPerWord.push(targets);
                p.background(0);
            }
        }
    };
}
