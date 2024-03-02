import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CollatzConjectureComponent } from "src/app/sketches/collatz-conjecture/collatz-conjecture.component";

describe("CollatzConjectureComponent", () => {
    let component: CollatzConjectureComponent;
    let fixture: ComponentFixture<CollatzConjectureComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CollatzConjectureComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CollatzConjectureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
