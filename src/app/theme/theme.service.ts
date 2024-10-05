import { DOCUMENT } from "@angular/common";
import { Inject, Injectable, signal, WritableSignal } from "@angular/core";

import { setLocalStorageItem } from "src/app/storage/local-storage";

@Injectable({
    providedIn: "root",
})
export class ThemeService {
    private readonly lightTheme = "aura-light-pink.css";
    private readonly darkTheme = "aura-dark-pink.css";
    private readonly themeLink: HTMLLinkElement;
    readonly isLightTheme: WritableSignal<boolean>;

    constructor(@Inject(DOCUMENT) readonly document: Document) {
        this.themeLink = this.document.getElementById("app-theme") as HTMLLinkElement;
        this.isLightTheme = signal<boolean>(this.themeLink.href.split("/").pop()?.includes("-light-") ?? true);
    }

    switchTheme(): void {
        this.isLightTheme.update((value) => !value);
        this.themeLink.href = this.isLightTheme() ? this.lightTheme : this.darkTheme;
        setLocalStorageItem("theme", this.isLightTheme() ? "light" : "dark");
    }
}
