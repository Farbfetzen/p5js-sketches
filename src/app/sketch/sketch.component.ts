import p5 from "p5";

import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnDestroy, booleanAttribute } from "@angular/core";

import { ToolbarService } from "src/app/toolbar/toolbar.service";

@Component({
    selector: "app-sketch",
    standalone: true,
    imports: [],
    template: ``,
    styles: `
        :host {
            display: block;
            width: fit-content;
        }
        :host.center-horiz {
            margin: 0 auto;
        }
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
    private refreshButtonSubscription;

    constructor(
        private hostElement: ElementRef,
        toolbarService: ToolbarService,
    ) {
        this.refreshButtonSubscription = toolbarService.refreshButtonEvent$.subscribe(() => this.refresh());
    }

    ngAfterViewInit(): void {
        this.sketch = new p5(this.sketchFun, this.hostElement.nativeElement);
    }

    ngOnDestroy(): void {
        this.refreshButtonSubscription.unsubscribe();
        this.sketch.remove();
    }

    refresh(): void {
        this.sketch.remove();
        this.sketch = new p5(this.sketchFun, this.hostElement.nativeElement);
    }
}
