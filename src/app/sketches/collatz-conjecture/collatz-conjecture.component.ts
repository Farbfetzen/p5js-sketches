import { random } from "mathjs";
import p5 from "p5";

import { Component } from "@angular/core";

import { SketchComponent } from "src/app/sketch/sketch.component";

@Component({
    selector: "app-collatz-conjecture",
    standalone: true,
    imports: [SketchComponent],
    template: `<app-sketch [sketchFun]="createSketch" centeredHorizontally="true" />`,
})
export class CollatzConjectureComponent {
    createSketch = (p: p5) => {
        p.setup = () => {
            p.createCanvas(600, 600);
            p.noLoop();
        };

        p.draw = () => {
            p.background(30, 10, 70);
            const length = 5;
            const angle = 0.23;
            for (let i = 1; i < 10_000; i++) {
                let n = i;
                const sequence = [n];
                while (n > 1) {
                    n = collatz(n);
                    sequence.push(n);
                }
                sequence.reverse();

                p.resetMatrix();
                p.translate(p.width / 2, p.height / 2);
                p.stroke(random(100, 220), random(50, 250), random(180), 20);
                for (const element of sequence) {
                    if (element % 2 === 0) {
                        p.rotate(angle);
                    } else {
                        p.rotate(-angle);
                    }
                    p.line(0, 0, 0, -length);
                    p.translate(0, -length);
                }
            }
        };

        function collatz(n: number) {
            if (n % 2 === 0) {
                return n / 2;
            }
            return n * 3 + 1;
        }
    };
}