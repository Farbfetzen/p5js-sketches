import { Injectable, signal } from "@angular/core";

import { finalize, Subject, Subscription } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class RefreshService {
    private readonly subject = new Subject<Event>();
    private readonly observable = this.subject
        .asObservable()
        .pipe(finalize(() => this.isObserved.set(this.subject.observed)));
    readonly isObserved = signal(this.subject.observed);

    refreshButtonTriggered(event: Event): void {
        this.subject.next(event);
    }

    subscribe(callback: (value: Event) => void): Subscription {
        this.isObserved.set(true);
        return this.observable.subscribe(callback);
    }
}
