import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { FormData } from 'src/app/interfaces/formData.interface';
import { AlertController, NavController } from '@ionic/angular';
import { EnviamentService } from 'src/services/enviament.service';
import { FormService } from 'src/services/forms.service';
import { ActivatedRoute } from '@angular/router';
import { Enviament } from 'src/app/interfaces/enviament.interface';
import { AthForm } from 'src/app/interfaces/athenea-form.interface';
import { environment } from 'src/environments/environment';



export interface AtheneaFormInputs {
  _id: string;
  questions: any[];                
  title: string;                   
  lang: any;                     
  preview: Preview;                
  canAnswer: boolean;               
  end: any;        
  availableDate: Date;
  answersId: string;
  useLocalStorage: boolean;  
  useSaveProgress: SaveProgressOptions;      
}


interface Preview {
  title: string | null;
  subtitle: string | null;
  desc_html: string | null;
  button: string;
}

interface SaveProgressOptions {
  saveEndpoint: string,
  getEndpoint: string,
  enabled: boolean
}

@Component({
  selector: 'app-list-athenea-forms',
  styleUrls: ['./list-athenea-forms.page.scss'],
  templateUrl: './list-athenea-forms.page.html',
})
export class ListAtheneaFormsPage implements OnInit {
  loading = true;

  finalForms: AtheneaFormInputs[] = [];
  forms: AthForm[] = [];
  formsData: FormData[] = [];
  form: any;
  enviament: Enviament = {};


    constructor(
      private route: ActivatedRoute,
      private enviamentService: EnviamentService,
      private formService: FormService,
      public userService: UserService,
      public navCtrl: NavController,
      public alertCtrl: AlertController
    ) { }
  enviamentId: string | null = '';
  id: string="test";
  questions: any[] = [];
  title = '';
  lang = 'ca';
    preview:Preview = {
    title: "test",
    subtitle: "Ara registraràs uns paràmetres de la teva salut. Tardaràs 2 minuts.",
    desc_html: "<ul><p></p><li><b>De què es tracta?</b></li>Aquests qüestionaris ens ajudaran a entendre com et trobes a casa. Volem saber com estan alguns paràmetres per assegurar-nos que tot està en ordre.<p></p><p></p><li><b>Per què t'ho demanem?</b></li>Sabem que alguns paràmetres importants del teu cos poden canviar per diversos factors. Ens interessa conèixer aquests paràmetres per comprendre com t’afecta la malaltia i com podem ajudar-te millor.<p></p><p></p><li><b>Per què ens servirà?</b></li>Les teves respostes ens permetran revisar alguns paràmetres del teu cos. Amb aquesta informació, adaptarem les intervencions i les recomanacions que reps perquè siguin el més efectives possibles.<p></p></ul>",
    button: "Comenzar"
  };
  canAnswer = true;
  end:any = { 
  ca:"ca",
  es: "es",
  en: "en"
};
  availableDate: Date = new Date();
  answersId:string = "id"
  useLocalStorage = true;
  useSaveProgress:SaveProgressOptions = {
    saveEndpoint: `${environment.FORMS_ENDPOINT}/progress/icura`,
    getEndpoint: `${environment.FORMS_ENDPOINT}/progress/icura`,
    enabled: true
  };

  async ngOnInit() {
    this.loading = true;
    this.enviamentId = this.route.snapshot.paramMap.get('id');

    try {
      if (this.enviamentId) {
        const response = await this.enviamentService.getEnviament(this.enviamentId);
        this.enviament = response['enviament'];
      }
      if (Array.isArray(this.enviament.forms_data)) {
        this.formsData = this.enviament.forms_data;
        this.forms = [];
        for (const formData of this.formsData) {
          if ((this.userService.lastPatientRole == 'firstfamiliar' || this.userService.lastPatientRole == 'secondfamiliar') && (formData.role == 'familiar' || formData.role  == 'both') ) {
            if (formData.id_form) {
              const form = await this.formService.getAtheneaForm(formData.id_form!);
              if (form['form'].responder != 'professional') {
                this.forms.push(form['form']);
              }
            }
          }
          if ((this.userService.lastPatientRole == 'patient') && (formData.role  == 'patient' || formData.role  == 'both') ) {
            if (formData.id_form) {
              const form = await this.formService.getAtheneaForm(formData.id_form!);
              if (form['form'].responder != 'professional') {
                this.forms.push(form['form']);
              }
            }
          }
        };
        this.forms.sort((a, b) => a.order! - b.order!);
      }
    } catch (e) {
      this.showError("Hi ha hagut un error en carregar els qüestionaris, torna a intentar-ho.", true);
      console.error(e);
    }
    try {
      this.prepareFormsFromLocalJson(this.forms);
    } finally {
      this.loading = false;
    }
  }


  private prepareFormsFromLocalJson(forms: AthForm[]) {
    const allQuestionsArrays: any[][] = forms.map((form) => {
      const qs = form?.questions ?? [];
      return Array.isArray(qs) ? qs : [];
    });

    this.finalForms = forms.map((form, index): AtheneaFormInputs => {
      const _id = form?._id ?? `form_${index + 1}`;
      const title = form?.title ?? 'Example title';        
      const lang = 'ca';                           
      const preview = this.preview;
      const canAnswer =  true; 
      const end = this.end;
      const availableDate =  this.availableDate;
      const answersId =  this.answersId;
      const useLocalStorage = this.useLocalStorage;   
      const useSaveProgress = this.useSaveProgress;               

      const questions = allQuestionsArrays[index];

      return {
        _id,
        questions,
        title,
        lang,
        preview,
        canAnswer,
        end,
        availableDate,
        answersId,
        useLocalStorage,
        useSaveProgress,
      };
    });
  }
  
 async openForm(form: AtheneaFormInputs) {
  // TODO: descomentar el condicional
  //if (!this.hasResponses(form.id!)) {

      await this.navCtrl.navigateForward(
        ['list-athenea-forms', 'view-forms', form._id],
        {
          queryParams: {
            title: form.title,
            lang: form.lang,
            canAnswer: form.canAnswer,
          },
          state: {
            preview: this.preview,
            end: form.end,
            availableDate: form.availableDate,
            answersId: form.answersId,
            useLocalStorage: form.useLocalStorage,
            useSaveProgress: form.useSaveProgress,
            questions: form.questions,
            enviamentId: this.enviamentId,
          }
        }
      );
   // }
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

  closeForm() {
    // this.activeForm = null;
  }

  showError(message: string, navBack: boolean = false) {
    this.alertCtrl.create({
      header: 'Error',
      message,
      buttons: [{
        text: 'Aceptar',
        role: 'cancel',
        handler: () => {
          if (navBack) this.navCtrl.back();
        }
      }]
    }).then(alert => alert.present());

  }
}

