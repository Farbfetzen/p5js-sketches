import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Noise1dComponent } from "src/app/sketches/noise1d/noise1d.component";

describe("Noise1dComponent", () => {
    let component: Noise1dComponent;
    let fixture: ComponentFixture<Noise1dComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Noise1dComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(Noise1dComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
