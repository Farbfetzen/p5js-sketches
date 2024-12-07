import { Routes } from "@angular/router";

import { HomeComponent } from "src/app/home/home.component";
import { CollatzConjectureComponent } from "src/app/sketches/collatz-conjecture/collatz-conjecture.component";
import { ColorbandsComponent } from "src/app/sketches/colorbands/colorbands.component";
import { CornerCuttingComponent } from "src/app/sketches/corner-cutting/corner-cutting.component";
import { EpicyclesComponent } from "src/app/sketches/epicycles/epicycles.component";
import { FallingSandComponent } from "src/app/sketches/falling-sand/falling-sand.component";
import { FireflyMessagesComponent } from "src/app/sketches/firefly-messages/firefly-messages.component";
import { FloodFillComponent } from "src/app/sketches/flood-fill/flood-fill.component";
import { InputTestComponent } from "src/app/sketches/input-test/input-test.component";
import { LangtonsAntComponent } from "src/app/sketches/langtons-ant/langtons-ant.component";
import { Noise1dComponent } from "src/app/sketches/noise1d/noise1d.component";
import { Noise2dHslComponent } from "src/app/sketches/noise2d-hsl/noise2d-hsl.component";
import { Noise2dComponent } from "src/app/sketches/noise2d/noise2d.component";
import { PerlinNoiseFlowFieldComponent } from "src/app/sketches/perlin-noise-flow-field/perlin-noise-flow-field.component";
import { TouchingCirclesComponent } from "src/app/sketches/touching-circles/touching-circles.component";

export const routes: Routes = [
    { path: "", component: HomeComponent },
    {
        path: "sketch",
        children: [
            { path: "collatz-conjecture", component: CollatzConjectureComponent, title: "Collatz Conjecture" },
            { path: "colorbands", component: ColorbandsComponent, title: "Colorbands" },
            { path: "corner-cutting", component: CornerCuttingComponent, title: "Corner-Cutting" },
            { path: "epicycles", component: EpicyclesComponent, title: "Epicycles" },
            { path: "falling-sand", component: FallingSandComponent, title: "Falling Sand" },
            { path: "firefly-messages", component: FireflyMessagesComponent, title: "Firefly Messages" },
            { path: "flood-fill", component: FloodFillComponent, title: "Flood Fill" },
            { path: "input-test", component: InputTestComponent, title: "Input Test" },
            { path: "langtons-ant", component: LangtonsAntComponent, title: "Langton's Ant" },
            { path: "noise1d", component: Noise1dComponent, title: "1D Noise Graph" },
            { path: "noise2d", component: Noise2dComponent, title: "2D Noise" },
            { path: "noise2dHsl", component: Noise2dHslComponent, title: "2D Noise with HSL" },
            {
                path: "perlin-noise-flow-field",
                component: PerlinNoiseFlowFieldComponent,
                title: "Perlin Noise Flow Field",
            },
            { path: "touching-circles", component: TouchingCirclesComponent, title: "Touching Circles" },
        ],
    },
];
