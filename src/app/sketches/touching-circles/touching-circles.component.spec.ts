import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TouchingCirclesComponent } from "src/app/sketches/touching-circles/touching-circles.component";

describe("TouchingCirclesComponent", () => {
    let component: TouchingCirclesComponent;
    let fixture: ComponentFixture<TouchingCirclesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TouchingCirclesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TouchingCirclesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
