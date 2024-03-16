import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FallingSandComponent } from "src/app/sketches/falling-sand/falling-sand.component";

describe("FallingSandComponent", () => {
    let component: FallingSandComponent;
    let fixture: ComponentFixture<FallingSandComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FallingSandComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FallingSandComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
