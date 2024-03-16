import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EpicyclesComponent } from "src/app/sketches/epicycles/epicycles.component";

describe("EpicyclesComponent", () => {
    let component: EpicyclesComponent;
    let fixture: ComponentFixture<EpicyclesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EpicyclesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EpicyclesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
