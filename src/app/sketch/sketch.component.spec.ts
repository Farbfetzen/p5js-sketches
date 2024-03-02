import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SketchComponent } from "src/app/sketch/sketch.component";

describe("SketchComponent", () => {
    let component: SketchComponent;
    let fixture: ComponentFixture<SketchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SketchComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SketchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
