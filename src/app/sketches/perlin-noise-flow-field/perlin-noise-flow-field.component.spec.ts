import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PerlinNoiseFlowFieldComponent } from "src/app/sketches/perlin-noise-flow-field/perlin-noise-flow-field.component";

describe("PerlinNoiseFlowFieldComponent", () => {
    let component: PerlinNoiseFlowFieldComponent;
    let fixture: ComponentFixture<PerlinNoiseFlowFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PerlinNoiseFlowFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PerlinNoiseFlowFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
