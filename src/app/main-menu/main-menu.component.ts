import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

import { RefreshService } from "src/app/refresh/refresh.service";
import { ThemeService } from "src/app/theme/theme.service";

@Component({
    selector: "app-main-menu",
    standalone: true,
    imports: [ButtonModule, RouterLink, TooltipModule],
    template: `
        <a
            [outlined]="true"
            [rounded]="true"
            icon="pi pi-home"
            pButton
            pTooltip="Go to overview"
            routerLink="/"
            showDelay="500"
            aria-label="Home"
        ></a>
        <p-button
            [icon]="'pi ' + (themeService.isLightTheme() ? 'pi-sun' : 'pi-moon')"
            [outlined]="true"
            [rounded]="true"
            (onClick)="themeService.switchTheme()"
            ariaLabel="Switch theme"
            pTooltip="Switch to {{ themeService.isLightTheme() ? 'dark' : 'light' }} theme"
            showDelay="500"
        />
        @if (refreshService.isObserved()) {
            <p-button
                [outlined]="true"
                [rounded]="true"
                (onClick)="refreshService.refreshButtonTriggered()"
                icon="pi pi-refresh"
                pTooltip="Refresh the sketch"
                showDelay="500"
            />
        }
    `,
})
export class MainMenuComponent {
    constructor(
        public readonly refreshService: RefreshService,
        public readonly themeService: ThemeService,
    ) {}
}
