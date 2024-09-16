import { ApplicationConfig } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { TitleStrategy, provideRouter } from "@angular/router";

import { routes } from "src/app/app.routes";
import { AppTitleStrategy } from "src/app/title-strategy/app-title-strategy";

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), { provide: TitleStrategy, useClass: AppTitleStrategy }, provideAnimations()],
};
