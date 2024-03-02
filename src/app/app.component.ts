import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { ToolbarComponent } from "src/app/toolbar/toolbar.component";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, ToolbarComponent],
    template: `
        <app-toolbar />
        <router-outlet />
    `,
})
export class AppComponent {}
