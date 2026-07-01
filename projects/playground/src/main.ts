import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { chevronUpOutline, chevronDownOutline } from 'ionicons/icons';

addIcons({
  'chevron-up-outline': chevronUpOutline,
  'chevron-down-outline': chevronDownOutline
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
