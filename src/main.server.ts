import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/core/app';
import { config } from './app/core/app.config.server';

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;
