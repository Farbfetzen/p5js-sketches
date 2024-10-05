import { TestBed } from "@angular/core/testing";

import { ThemeService } from "src/app/theme/theme.service";

describe("ThemeService", () => {
    let service: ThemeService;

    function setAppThemeElement(): void {
        const link = document.createElement("link");
        link.id = "app-theme";
        link.href = "aura-light-pink.css";
        link.rel = "stylesheet";
        link.type = "text/css";
        document.head.appendChild(link);
    }

    beforeEach(() => {
        setAppThemeElement();

        TestBed.configureTestingModule({});
        service = TestBed.inject(ThemeService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
