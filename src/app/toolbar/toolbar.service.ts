import { Injectable } from "@angular/core";

import { Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ToolbarService {
    private _refreshButtonEvent = new Subject<Event>();

    refreshButtonTriggered(event: Event): void {
        this._refreshButtonEvent.next(event);
    }

    get refreshButtonEvent$() {
        return this._refreshButtonEvent.asObservable();
    }

    refreshButtonHasObservers(): boolean {
        return this._refreshButtonEvent.observed;
    }
}
