import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/core/app.config';
import { App } from './app/core/app';

bootstrapApplication(App, appConfig)
.catch((err) => {/* ...existing code... */});
