import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { SidebarComponent } from "src/app/sidebar/sidebar.component";
import { ThemeService } from "src/app/theme/theme.service";

describe("SidebarComponent", () => {
    let component: SidebarComponent;
    let themeService: jasmine.SpyObj<ThemeService>;

    beforeEach(async () => {
        themeService = jasmine.createSpyObj("ThemeService", ["switchTheme"], { isLightTheme: signal(true) });

        await TestBed.configureTestingModule({
            imports: [SidebarComponent],
            providers: [provideRouter([]), { provide: ThemeService, useValue: themeService }],
        }).compileComponents();

        const fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
