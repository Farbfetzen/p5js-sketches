import p5 from "p5";

import { TestBed } from "@angular/core/testing";

import { RefreshService } from "src/app/refresh/refresh.service";
import { SketchComponent } from "src/app/sketch/sketch.component";

describe("SketchComponent", () => {
    let component: SketchComponent;
    let refreshService: RefreshService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SketchComponent],
        }).compileComponents();
        const fixture = TestBed.createComponent(SketchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        refreshService = TestBed.inject(RefreshService);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should unsubscribe from RefreshService on destroy", () => {
        expect(refreshService.isObserved()).toBeTrue();
        component.ngOnDestroy();
        expect(refreshService.isObserved()).toBeFalse();
    });

    it(`should reset the noise seed in ngAfterViewInit`, () => {
        const sketch = new p5(component.sketchFun);
        const initialValue = sketch.noise(0);
        component.ngAfterViewInit();
        expect(sketch.noise(0)).not.toEqual(initialValue);
    });

    it(`should reset the noise seed in refresh`, () => {
        const sketch = new p5(component.sketchFun);
        const initialValue = sketch.noise(0);
        component.refresh();
        expect(sketch.noise(0)).not.toEqual(initialValue);
    });
});
