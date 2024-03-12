import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Noise2dHslComponent } from "src/app/sketches/noise2d-hsl/noise2d-hsl.component";

describe("Noise2dHslComponent", () => {
    let component: Noise2dHslComponent;
    let fixture: ComponentFixture<Noise2dHslComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Noise2dHslComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(Noise2dHslComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
