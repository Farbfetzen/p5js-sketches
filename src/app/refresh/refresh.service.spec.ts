import { TestBed } from "@angular/core/testing";

import { RefreshService } from "src/app/refresh/refresh.service";

describe("RefreshService", () => {
    let service: RefreshService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RefreshService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should subscribe, trigger, and unsubscribe with one subscription", () => {
        const refreshSpy = jasmine.createSpy("RefreshSpy");
        const event = {} as Event;
        expect(service.isObserved()).toBeFalse();

        const subscription = service.subscribe(refreshSpy);
        expect(service.isObserved()).toBeTrue();

        service.refreshButtonTriggered(event);
        expect(refreshSpy).toHaveBeenCalledOnceWith(event);

        subscription.unsubscribe();
        expect(service.isObserved()).toBeFalse();
    });

    it("should subscribe, trigger, and unsubscribe with two subscriptions", () => {
        const refreshSpy1 = jasmine.createSpy("RefreshSpy1");
        const refreshSpy2 = jasmine.createSpy("RefreshSpy2");
        const event = {} as Event;
        expect(service.isObserved()).toBeFalse();

        const subscription1 = service.subscribe(refreshSpy1);
        expect(service.isObserved()).toBeTrue();
        const subscription2 = service.subscribe(refreshSpy2);
        expect(service.isObserved()).toBeTrue();

        service.refreshButtonTriggered(event);
        expect(refreshSpy1).toHaveBeenCalledOnceWith(event);
        expect(refreshSpy2).toHaveBeenCalledOnceWith(event);

        subscription1.unsubscribe();
        expect(service.isObserved()).toBeTrue();
        subscription2.unsubscribe();
        expect(service.isObserved()).toBeFalse();
    });
});
