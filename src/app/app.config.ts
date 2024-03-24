import { ApplicationConfig } from "@angular/core";
import { TitleStrategy, provideRouter } from "@angular/router";

import { routes } from "src/app/app.routes";
import { CustomTitleStrategy } from "src/app/custom-title-strategy";

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), { provide: TitleStrategy, useClass: CustomTitleStrategy }],
};
