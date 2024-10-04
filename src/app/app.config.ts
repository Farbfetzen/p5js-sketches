import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { TitleStrategy, provideRouter } from "@angular/router";

import { routes } from "src/app/app.routes";
import { AppTitleStrategy } from "src/app/title-strategy/app-title-strategy";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimations(),
        { provide: TitleStrategy, useClass: AppTitleStrategy },
    ],
};
