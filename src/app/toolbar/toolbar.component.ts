import { Component } from "@angular/core";

import { ToolbarService } from "src/app/toolbar/toolbar.service";

@Component({
    selector: "app-toolbar",
    standalone: true,
    imports: [],
    templateUrl: "./toolbar.component.html",
})
export class ToolbarComponent {
    constructor(public toolbarService: ToolbarService) {}
}
