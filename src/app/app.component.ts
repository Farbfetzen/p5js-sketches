import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { MainMenuComponent } from "src/app/main-menu/main-menu.component";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, MainMenuComponent],
    template: `
        <app-main-menu class="menu-overlay overlay-left" />
        <router-outlet />
    `,
})
export class AppComponent {}
