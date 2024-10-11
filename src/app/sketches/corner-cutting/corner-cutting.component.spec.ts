import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CornerCuttingComponent } from "src/app/sketches/corner-cutting/corner-cutting.component";

describe("CornerCuttingComponent", () => {
    let component: CornerCuttingComponent;
    let fixture: ComponentFixture<CornerCuttingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CornerCuttingComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CornerCuttingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
