import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { MfaComponent } from './app/mfa/mfa.component';

bootstrapApplication(MfaComponent, appConfig).catch((err) =>
  console.error(err)
);
