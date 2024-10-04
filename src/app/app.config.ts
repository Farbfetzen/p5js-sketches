import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { TitleStrategy, provideRouter } from "@angular/router";

import { routes } from "src/app/app.routes";
import { AppTitleStrategy } from "src/app/title-strategy/app-title-strategy";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        { provide: TitleStrategy, useClass: AppTitleStrategy },
    ],
};
