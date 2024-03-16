import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FireflyMessagesComponent } from "src/app/sketches/firefly-messages/firefly-messages.component";

describe("FireflyMessagesComponent", () => {
    let component: FireflyMessagesComponent;
    let fixture: ComponentFixture<FireflyMessagesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FireflyMessagesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FireflyMessagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
