import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";

@Injectable({ providedIn: "root" })
export class CustomTitleStrategy extends TitleStrategy {
    readonly baseTitle = "p5.js-Sketches";

    constructor(private readonly titleService: Title) {
        super();
    }

    override updateTitle(snapshot: RouterStateSnapshot): void {
        const routeTitle = this.buildTitle(snapshot);
        const title = routeTitle ? `${routeTitle} | ${this.baseTitle}` : this.baseTitle;
        this.titleService.setTitle(title);
    }
}
