import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Noise2dComponent } from "src/app/sketches/noise2d/noise2d.component";

describe("Noise2dComponent", () => {
    let component: Noise2dComponent;
    let fixture: ComponentFixture<Noise2dComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Noise2dComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(Noise2dComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
