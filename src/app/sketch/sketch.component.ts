import p5 from "p5";

import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnDestroy, booleanAttribute } from "@angular/core";

import { RefreshService } from "src/app/refresh/refresh.service";

@Component({
    selector: "app-sketch",
    standalone: true,
    template: ``,
    styles: `
        // :host {
        //     display: block;
        //     width: fit-content;
        // }
        // :host.center-horiz {
        //     margin: 0 auto;
        // }
    `,
})
export class SketchComponent implements AfterViewInit, OnDestroy {
    /** A function that creates a sketch. */
    @Input({ required: true }) sketchFun!: (p: p5) => void;

    /** Set true if the sketch component should be centered horizontally in its container. */
    @Input({ transform: booleanAttribute })
    @HostBinding("class.center-horiz")
    centeredHorizontally = false;

    private sketch!: p5;
    private readonly refreshButtonSubscription;

    constructor(
        private readonly hostElement: ElementRef<HTMLElement>,
        readonly refreshService: RefreshService,
    ) {
        this.refreshButtonSubscription = refreshService.subscribe(() => this.refresh());
    }

    ngAfterViewInit(): void {
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
