import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

import { RefreshService } from "src/app/refresh/refresh.service";

@Component({
    selector: "app-sidebar",
    standalone: true,
    imports: [ButtonModule, RouterLink, TooltipModule],
    template: `
        <a
            [outlined]="true"
            icon="pi pi-home"
            pButton
            pTooltip="Home"
            routerLink="/"
            showDelay="500"
            aria-label="Home"
        ></a>
        @if (refreshService.isObserved()) {
            <p-button
                [outlined]="true"
                [rounded]="true"
                (onClick)="refreshService.refreshButtonTriggered($event)"
                icon="pi pi-refresh"
            />
        }
    `,
})
export class SidebarComponent {
    constructor(public readonly refreshService: RefreshService) {}
}
