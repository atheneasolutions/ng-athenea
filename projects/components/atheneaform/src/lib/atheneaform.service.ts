import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormComponent, Question } from './form-component/form.component';

@Injectable({
  providedIn: 'root'
})
export class AtheneaformService {

  constructor(
    private modalCtrl: ModalController
  ) { }

  public async presentModal(questions: Question[], title: string, lang: 'ca' | 'es' | 'en' = 'ca') {
    let form = await this.modalCtrl.create({
      component: FormComponent,
      componentProps: {
        questions: questions,
        lang: lang,
        title: title
      }
      // cssClass: ''
    });
    await form.present();
    return form.onDidDismiss();
  }
}
