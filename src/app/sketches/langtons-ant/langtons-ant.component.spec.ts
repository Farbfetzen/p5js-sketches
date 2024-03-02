import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LangtonsAntComponent } from "src/app/sketches/langtons-ant/langtons-ant.component";

describe("LangtonsAntComponent", () => {
    let component: LangtonsAntComponent;
    let fixture: ComponentFixture<LangtonsAntComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LangtonsAntComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LangtonsAntComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
