import { DOCUMENT } from "@angular/common";
import { Component } from "@angular/core";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { provideRouter, Router, Routes, TitleStrategy } from "@angular/router";

import { AppTitleStrategy } from "src/app/title-strategy/app-title-strategy";

// Inspiration for these tests:
// - https://jamienordmeyer.medium.com/unit-testing-a-custom-angular-title-strategy-64d05f3d401f
// - https://github.com/angular/angular/blob/main/packages/router/test/page_title_strategy_spec.ts
// - https://github.com/angular/angular/blob/main/adev/src/app/core/services/a-dev-title-strategy.spec.ts

@Component({})
class MockComponent {}

describe("AppTitleStrategy", () => {
    const baseTitle = "p5.js-Sketches";
    const routes: Routes = [
        { path: "no-title", component: MockComponent },
        { path: "empty-title", component: MockComponent, title: "" },
        { path: "with-title", component: MockComponent, title: "test" },
        {
            path: "parent-without-title",
            children: [
                { path: "child-with-title", component: MockComponent, title: "child" },
                { path: "child-without-title", component: MockComponent },
            ],
        },
        {
            path: "parent-with-title",
            title: "parent",
            children: [
                { path: "child-with-title", component: MockComponent, title: "child" },
                { path: "child-without-title", component: MockComponent },
            ],
        },
    ];
    let document: Document;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter(routes), { provide: TitleStrategy, useClass: AppTitleStrategy }],
        });
        document = TestBed.inject(DOCUMENT);
        router = TestBed.inject(Router);

        expect(document.title).toEqual("");
    });

    afterEach(() => {
        document.title = "";
    });

    [
        {
            description: "should set the base title if the route has no title",
            url: "no-title",
            expectedTitle: baseTitle,
        },
        {
            description: "should set the base title if the route title is empty",
            url: "empty-title",
            expectedTitle: baseTitle,
        },
        {
            description: "should set the route title if it is provided",
            url: "with-title",
            expectedTitle: "test | " + baseTitle,
        },
        {
            description: "should set the child title if only the child has a title",
            url: "parent-without-title/child-with-title",
            expectedTitle: "child | " + baseTitle,
        },
        {
            description: "should use the base title if neither parent nor child have titles",
            url: "parent-without-title/child-without-title",
            expectedTitle: baseTitle,
        },
        {
            description: "should set the child title if parent and child have titles",
            url: "parent-with-title/child-with-title",
            expectedTitle: "child | " + baseTitle,
        },
        {
            description: "should set the parent title if only the parent has a title",
            url: "parent-with-title/child-without-title",
            expectedTitle: "parent | " + baseTitle,
        },
    ].forEach((params) =>
        it(
            params.description,
            fakeAsync(() => {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                router.navigateByUrl(params.url);
                tick();
                expect(document.title).toEqual(params.expectedTitle);
            }),
        ),
    );
});
