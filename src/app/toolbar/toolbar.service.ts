import { Injectable } from "@angular/core";

import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ToolbarService {
    private _refreshButtonEvent = new Subject<Event>();

    refreshButtonTriggered(event: Event): void {
        this._refreshButtonEvent.next(event);
    }

    get refreshButtonEvent$(): Observable<Event> {
        return this._refreshButtonEvent.asObservable();
    }

    refreshButtonHasObservers(): boolean {
        return this._refreshButtonEvent.observed;
    }
}
