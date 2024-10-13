/* eslint-disable @typescript-eslint/ban-ts-comment */
import p5 from "p5";
import { ButtonModule } from "primeng/button";
import { SliderModule } from "primeng/slider";

import { Component, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { SketchComponent } from "src/app/sketch/sketch.component";

/*
Method 1: Attatch a callback to the onClick of the p-button element.
    If the custom sketch variables and functions are attached to the sketch instance
    they can be accessed from the outside.
    This makes it necessary to ignore some errors because flipBackground is not a property of p5.

Method 2: Attach an event listener to the element.
    This is done by simply adding an event listener to the element which runs the desired callback.
    The element can be accessed either via ViewChild or from the document, e.g. document.getElementById.

Method 3: Bind the input value to a variable using ngModel and check that variable in draw().
    This does not work with noloop and is not suitable for click events.
    If the drawing should only be done when necessary, then draw() could be used for checking if the value changed
    and if so, call a separate drawing function.
*/

@Component({
    selector: "app-input-test",
    standalone: true,
    imports: [SketchComponent, ButtonModule, FormsModule, SliderModule],
    template: `
        <app-sketch [sketchFun]="createSketch" />

        <div class="menu-overlay overlay-right">
            <!-- Method 1 -->
            <!-- The $any() is necessary to avoid the ts error "Property 'flipBackground' does not exist on type"-->
            <p-button
                id="background-flipper"
                [outlined]="true"
                [rounded]="true"
                (onClick)="$any(sketchComponent.sketch).flipBackground()"
                label="flip background"
            />

            <!-- Method 2 -->
            <p-button id="fill-inverter" [outlined]="true" [rounded]="true" label="invert fill color" />

            <!-- Method 3 -->
            <div class="slider-with-label">
                <label for="circle-resizer">Diameter: {{ diameter }}px</label>
                <p-slider id="circle-resizer" [(ngModel)]="diameter" max="200" min="10" />
            </div>
        </div>
    `,
})
export class InputTestComponent {
    @ViewChild(SketchComponent) sketchComponent!: SketchComponent;
    diameter = 50;

    createSketch = (p: p5): void => {
        let darkBackground = true;
        const fillColor = p.color(255, 128, 0);

        // Method 1
        // @ts-expect-error
        p.flipBackground = (): void => {
            darkBackground = !darkBackground;
            // If noloop:
            // p.redraw();
        };

        // Method 2
        document.getElementById("fill-inverter")?.addEventListener("click", () => {
            fillColor.setRed(255 - p.red(fillColor));
            fillColor.setGreen(255 - p.green(fillColor));
            fillColor.setBlue(255 - p.blue(fillColor));
        });

        p.setup = (): void => {
            p.createCanvas(400, 400);
            p.background(128);
            p.noStroke();
        };

        p.draw = (): void => {
            // Method 1
            p.background(darkBackground ? 50 : 230);

            // Method 2
            p.fill(fillColor);

            // Method 3
            p.circle(p.width / 2, p.height / 2, this.diameter);
        };
    };
}
