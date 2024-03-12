import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ColorbandsComponent } from "src/app/sketches/colorbands/colorbands.component";

describe("ColorbandsComponent", () => {
    let component: ColorbandsComponent;
    let fixture: ComponentFixture<ColorbandsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ColorbandsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ColorbandsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
