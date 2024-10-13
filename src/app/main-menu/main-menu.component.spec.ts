import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { MainMenuComponent } from "src/app/main-menu/main-menu.component";
import { ThemeService } from "src/app/theme/theme.service";

describe("MainMenuComponent", () => {
    let component: MainMenuComponent;
    let themeService: jasmine.SpyObj<ThemeService>;

    beforeEach(async () => {
        themeService = jasmine.createSpyObj("ThemeService", ["switchTheme"], { isLightTheme: signal(true) });

        await TestBed.configureTestingModule({
            imports: [MainMenuComponent],
            providers: [provideRouter([]), { provide: ThemeService, useValue: themeService }],
        }).compileComponents();

        const fixture = TestBed.createComponent(MainMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
