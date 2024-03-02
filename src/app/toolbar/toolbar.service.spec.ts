import { TestBed } from "@angular/core/testing";

import { ToolbarService } from "src/app/toolbar/toolbar.service";

describe("ToolbarService", () => {
    let service: ToolbarService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolbarService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
