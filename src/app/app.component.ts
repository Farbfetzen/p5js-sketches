import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { SidebarComponent } from "src/app/sidebar/sidebar.component";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, SidebarComponent],
    template: `
        <app-sidebar />
        <router-outlet />
    `,
})
export class AppComponent {}
