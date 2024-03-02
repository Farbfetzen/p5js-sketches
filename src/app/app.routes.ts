import { Routes } from "@angular/router";

import { CollatzConjectureComponent } from "src/app/sketches/collatz-conjecture/collatz-conjecture.component";
import { LangtonsAntComponent } from "src/app/sketches/langtons-ant/langtons-ant.component";
import { WelcomeComponent } from "src/app/welcome/welcome.component";

export const routes: Routes = [
    { path: "", component: WelcomeComponent },
    {
        path: "sketch",
        children: [
            { path: "collatz-conjecture", component: CollatzConjectureComponent },
            { path: "langtons-ant", component: LangtonsAntComponent },
        ],
    },
];
