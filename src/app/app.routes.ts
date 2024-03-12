import { Routes } from "@angular/router";

import { CollatzConjectureComponent } from "src/app/sketches/collatz-conjecture/collatz-conjecture.component";
import { LangtonsAntComponent } from "src/app/sketches/langtons-ant/langtons-ant.component";
import { Noise1dComponent } from "src/app/sketches/noise1d/noise1d.component";
import { Noise2dHslComponent } from "src/app/sketches/noise2d-hsl/noise2d-hsl.component";
import { Noise2dComponent } from "src/app/sketches/noise2d/noise2d.component";
import { WelcomeComponent } from "src/app/welcome/welcome.component";

export const routes: Routes = [
    { path: "", component: WelcomeComponent },
    {
        path: "sketch",
        children: [
            { path: "collatz-conjecture", component: CollatzConjectureComponent },
            { path: "langtons-ant", component: LangtonsAntComponent },
            { path: "noise1d", component: Noise1dComponent },
            { path: "noise2d", component: Noise2dComponent },
            { path: "noise2dHsl", component: Noise2dHslComponent },
        ],
    },
];
