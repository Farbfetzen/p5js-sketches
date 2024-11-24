import p5 from "p5";

import { Component, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";

import { RefreshService } from "src/app/refresh/refresh.service";

@Component({
    selector: "app-sketch",
    standalone: true,
    template: ``,
})
export class SketchComponent implements OnInit, OnDestroy {
    /** A function that creates a sketch. */
    @Input({ required: true }) sketchFun!: (p: p5) => void;

    sketch!: p5;
    private readonly refreshButtonSubscription;

    constructor(
        private readonly hostElement: ElementRef<HTMLElement>,
        private readonly refreshService: RefreshService,
    ) {
        this.refreshButtonSubscription = this.refreshService.subscribe(() => this.refresh());
    }

    ngOnInit(): void {
        this.sketch = new p5(this.sketchFun, this.hostElement.nativeElement);
        this.resetNoise();
    }

    ngOnDestroy(): void {
        this.refreshButtonSubscription.unsubscribe();
        this.sketch.remove();
    }

    refresh(): void {
        this.sketch.remove();
        // Reset the noise before recreating the sketch.
        // Otherwise, the first click on the refresh button would create a sketch with the same seed.
        this.resetNoise();
        this.sketch = new p5(this.sketchFun, this.hostElement.nativeElement);
    }

    /**
     * Create a new noise seed so sketches don't reuse the same seed when they are recreated.
     * This must be done because the p5 object is not destroyed when the sketch is removed
     * and the seed seems to be global.
     */
    private resetNoise(): void {
        this.sketch.noiseSeed(this.sketch.random(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));
    }
}
