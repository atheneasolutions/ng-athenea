import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent, Items } from './popover.component';

@Injectable({
    providedIn: 'root'
})
export class PopoverService {

    constructor(
        private popoverCtrl: PopoverController
    ) {
    }

    async presentPopover(ev: Event, items: Items[]) {
        const popover = await this.popoverCtrl.create({
          component: PopoverComponent,
          componentProps: { items },
          event: ev,
        //   dismissOnSelect: true
        });
        await popover.present();
        return (await popover.onWillDismiss()).role;
      }

}
