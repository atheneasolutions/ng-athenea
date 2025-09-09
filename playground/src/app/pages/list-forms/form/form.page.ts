import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TypeForm } from 'src/app/interfaces/typeform.interface';
import { FormService } from 'src/services/forms.service';
import { createWidget } from '@typeform/embed';
import { UserService } from 'src/services/user.service';
import { EnviamentService } from 'src/services/enviament.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  formId: string = '';
  typeform: TypeForm = {};

  constructor(
    private route: ActivatedRoute,
    private formService: FormService,
    public userService: UserService,
    public envimentService: EnviamentService,
    private navCtrl: NavController
  ) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.formId = id;
      const typeform = await this.formService.getForm(this.formId);
      if (typeform) {
        this.typeform = typeform['typeform'];
      }
      this.crearTypeform();
    }
  }

  async crearTypeform() {
    createWidget(this.typeform.uuid!, {
      domain: "tauli.eu.typeform.com",
      container: document.querySelector('#form')!,
      hidden: {
        user_id: this.userService.lastPatientId!,
        form_id: this.typeform.id!,
        enviament_id: this.envimentService.idEnviament!,
        role: this.envimentService.role!,
      },
      onSubmit: () => {
        this.envimentService.markFormAsResponded(this.typeform.id!);
        setTimeout(() => {
          this.navCtrl.back();          
        }, 500);
      },
    });
  }

}
