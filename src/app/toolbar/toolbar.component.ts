import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

import { ToolbarService } from "src/app/toolbar/toolbar.service";

@Component({
    selector: "app-toolbar",
    standalone: true,
    imports: [RouterLink],
    templateUrl: "./toolbar.component.html",
})
export class ToolbarComponent {
    constructor(public toolbarService: ToolbarService) {}
}
