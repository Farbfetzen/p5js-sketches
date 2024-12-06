import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

interface SketchPanel {
    link: string;
    linkText: string;
    description: string;
}

@Component({
    selector: "app-home",
    standalone: true,
    imports: [RouterLink],
    templateUrl: "./home.component.html",
})
export class HomeComponent {
    readonly sketchPanels: SketchPanel[] = [
        {
            link: "input-test",
            linkText: "Input Test",
            description: "Testing ways to manipulate a sketch using separately defined input elements.",
        },
        {
            link: "corner-cutting",
            linkText: "Corner Cutting",
            description: "Chaikin's corner cutting algorithm.",
        },
        {
            link: "flood-fill",
            linkText: "Flood Fill",
            description: "For resting a flood fill algorithm.",
        },
        {
            link: "falling-sand",
            linkText: "Falling Sand",
            description: "A simple falling sand simulation.",
        },
        {
            link: "langtons-ant",
            linkText: "Langton's Ant",
            description: `A two-dimensional Turing machine.
                See <a href="https://en.wikipedia.org/wiki/Langton%27s_ant" target="_blank">Wikipedia</a>.`,
        },
        {
            link: "firefly-messages",
            linkText: "Firefly Messages",
            description: `Particles forming words.
                Inspired by the helpful messages in the game "Oddworld: Abe's Oddysee".`,
        },
        {
            link: "epicycles",
            linkText: "Epicycles",
            description: "Epicycle animations.",
        },
        {
            link: "noise2dHsl",
            linkText: "2D Noise with HSL",
            description: `Exploring the HSL color space with 2d Perlin noise while trying to get
                a wide color distribution.`,
        },
        {
            link: "perlin-noise-flow-field",
            linkText: "Perlin Noise Flow Field",
            description: `A Perlin noise flow field based on the video
                <a href="https://www.youtube.com/watch?v=BjoM9oKOAKY" target="_blank">
                    Coding Challenge #24: Perlin Noise Flow Field
                </a>
                by <a href="https://www.youtube.com/@TheCodingTrain" target="_blank">The Coding Train</a>.`,
        },
        {
            link: "colorbands",
            linkText: "Colorbands",
            description: `An experiment with HSL colorspace and trying to get a uniform color distribution
                from normal distributed noise.`,
        },
        {
            link: "noise2d",
            linkText: "2D Noise",
            description: `Experiments with 2D Perlin noise based on the video
                <a href="https://www.youtube.com/watch?v=ikwNrFvnL3g" target="_blank">
                    I.5: 2D Noise - Perlin Noise and p5.js Tutorial
                </a>
                by <a href="https://www.youtube.com/@TheCodingTrain" target="_blank">The Coding Train</a>.`,
        },
        {
            link: "noise1d",
            linkText: "1D Noise Graph",
            description: `An animated graph of 1D Perlin noise based on the video
                <a href="https://www.youtube.com/watch?v=y7sgcFhk6ZM" target="_blank">
                    I.4: Graphing 1D Perlin Noise - Perlin Noise and p5.js Tutorial
                </a>
                by <a href="https://www.youtube.com/@TheCodingTrain" target="_blank">The Coding Train</a>.`,
        },
        {
            link: "collatz-conjecture",
            linkText: "Collatz Conjecture",
            description: `A visualization of the Collatz conjecture based on the video
                <a href="https://www.youtube.com/watch?v=EYLWxwo1Ed8" target="_blank">Coding the Collatz Conjecture</a>
                by <a href="https://www.youtube.com/@TheCodingTrain" target="_blank">The Coding Train</a>.
                Takes a moment to load.`,
        },
    ];
}
