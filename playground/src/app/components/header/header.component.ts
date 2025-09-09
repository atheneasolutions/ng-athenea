import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UserService } from 'src/services/user.service';
import { Hospital } from 'src/shared/models/enums/Hospital';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title: string = '';
  @Input() subtitle: string | undefined;
  @Input() hospital: string | undefined;
  displayPerfil: boolean = true;
  logos: string[] = [];

  constructor(
    public userService: UserService,
    private popoverCtrl: PopoverController,
  ) {   }

  async presentPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: HeaderComponent,
      event: ev,
      mode:'ios',
      translucent: true,
    });
    await popover.present();
    const { data } = await popover.onWillDismiss();
  }

  ngOnInit(): void {
    if (this.hospital === Hospital.PARC_TAULI) {
      this.logos[0] = 'assets/img/logoParcTauli2023white.svg';
    } else if (this.hospital === Hospital.SON_ESPASES) {
      this.logos[0] = 'assets/img/son_espases.png';
      this.logos[1] = 'assets/img/son_espases_white.png';
    }
  }

}
