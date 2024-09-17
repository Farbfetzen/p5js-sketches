import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AppTitleStrategy extends TitleStrategy {
    private readonly baseTitle = "p5.js-Sketches";

    constructor(private readonly titleService: Title) {
        super();
    }

    override updateTitle(routerStateSnapshot: RouterStateSnapshot): void {
        const routeTitle = this.buildTitle(routerStateSnapshot);
        this.titleService.setTitle(routeTitle ? `${routeTitle} | ${this.baseTitle}` : this.baseTitle);
    }
}
