import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Enviament } from 'src/app/interfaces/enviament.interface';
import { FormData } from 'src/app/interfaces/formData.interface';
import { TypeForm } from 'src/app/interfaces/typeform.interface';
import { EnviamentService } from 'src/services/enviament.service';
import { FormService } from 'src/services/forms.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-list-forms',
  templateUrl: './list-forms.page.html',
  styleUrls: ['./list-forms.page.scss'],
})
export class ListFormsPage {

  enviament: Enviament = {};
  forms: TypeForm[] = [];
  formsData: FormData[] = [];
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private enviamentService: EnviamentService,
    public userService: UserService,
    private formService: FormService,
    public navCtrl: NavController,
  ) { }


  async ionViewWillEnter() {
    this.loading = true;
    const enviamentId = this.route.snapshot.paramMap.get('id');
    if (enviamentId) {
      const response = await this.enviamentService.getEnviament(enviamentId);
      this.enviament = response['enviament'];
      if (Array.isArray(this.enviament.forms_data)) {
        this.formsData = this.enviament.forms_data;
        this.forms = [];
        for (const formData of this.formsData) {
          if ((this.userService.lastPatientRole == 'firstfamiliar' || this.userService.lastPatientRole == 'secondfamiliar') && (formData.role == 'familiar' || formData.role  == 'both') ) {
            if (formData.id_form) {
              const form = await this.formService.getForm(formData.id_form!);
              if (form['typeform'].responder != 'professional') {
                this.forms.push(form['typeform']);
              }
            }
          }
          if ((this.userService.lastPatientRole == 'patient') && (formData.role  == 'patient' || formData.role  == 'both') ) {
            if (formData.id_form) {
              const form = await this.formService.getForm(formData.id_form!);
              if (form['typeform'].responder != 'professional') {
                this.forms.push(form['typeform']);
              }
            }
          }
        };
        this.forms.sort((a, b) => a.order! - b.order!);
      }
    }
    this.loading = false;
  }

  async obrirTypeform(form: TypeForm) {
    if (!this.hasResponses(form.id!)) {
      await this.navCtrl.navigateForward(`/list-forms/form/${form.id}`);
    }    
  }

  hasResponses(formId: string) {
    if (this.enviamentService.formResponded.includes(formId)) {
      return true;
    }
    for (let formData of this.formsData) {
        if (formData.id_form === formId) {
          if (this.enviamentService.role == 'patient') {
            const responses = formData.response_patient;
            if (responses && responses.length > 0) {
                return true;
            }
          } else if (this.enviamentService.role == 'firstfamiliar') {
            const responses = formData.response_first_familiar;
            if (responses && responses.length > 0) {
                return true;
            }
          } else if (this.enviamentService.role == 'secondfamiliar') {
            const responses = formData.response_second_familiar;
            if (responses && responses.length > 0) {
                return true;
            }
          }
        }
    }
    return false; 
  }
  

}
