import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { chevronUpOutline, chevronDownOutline, informationCircleOutline } from 'ionicons/icons';
import { register } from 'swiper/element/bundle';

register();

addIcons({
  'chevron-up-outline': chevronUpOutline,
  'chevron-down-outline': chevronDownOutline,
  'information-circle-outline': informationCircleOutline
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
