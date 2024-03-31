import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FloodFillComponent } from "src/app/sketches/flood-fill/flood-fill.component";

describe("FloodFillComponent", () => {
    let component: FloodFillComponent;
    let fixture: ComponentFixture<FloodFillComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FloodFillComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FloodFillComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
