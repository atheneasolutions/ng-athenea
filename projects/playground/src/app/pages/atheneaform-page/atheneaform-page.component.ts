import { Component } from '@angular/core';
import { AtheneaformComponent, Multilang, Preview, Question } from '@components/atheneaform';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-atheneaform-page',
  standalone: true,
  imports: [AtheneaformComponent, IonicModule],
  templateUrl: './atheneaform-page.component.html',
  styleUrl: './atheneaform-page.component.scss'
})
export class AtheneaformPageComponent {
  id: string = 'demo';
  answersId: string = 'demo_form_id_01';
  title: string = 'Qüestionari de prova';
  lang: 'ca' | 'es' | 'en' = 'ca';
  preview: Preview = {
    title: 'Títol de preview',
    subtitle: 'Subtítol de preview',
    desc_html: '<strong>html de prova</strong>',
    button: 'Botó de prova'
  };
  end: Multilang = {
    ca: 'Final',
    es: 'Final',
    en: 'Final'
  };
  formDate: Date = new Date();
  canAnswer:boolean = true;
  useLocalStorage: boolean = true;

  send(event: any) {
    console.log("#AtheneaFormPage - Answers sent: ", event);
  }


  questions: Question[] = [
    {
        id: "PES_ACT_PA",
        tag: "0",
        order: 0,
        label: {
            ca: "Pes es",
            es: "En general, hoy dia que su salud es...?",
            en: "In general, would you say your health today is ...?"
        },
        value: null,
      type: "scale",
      depends_on: null,
      main_tag: null,
        options: ""
    },
    {
        id: "PER_ABDOM",
        tag: "1",
        order: 1,
        label: {
            ca: "Perimetre es",
            es: "En general, hoy dia que su salud es...?",
            en: "In general, would you say your health today is ...?"
        },
        value: null,
      type: "unit",
      depends_on: null,
      main_tag: null,
        options: "",
        int_comparator_question: "PES_ACT_PA",
        int_comparator_condition: "greater_than",
        int_comparator_value: 200,
        type_unit: "cm",
        optional: true
    },
    {
        id: "SATISF_CAL",
        tag: "2",
        order: 2,
        depends_on: null,
        main_tag: null,
        label: {
            "ca": "Est\u00e0 satisfeta amb la seva qualitat de vida?",
            "es": "\u00bfEst\u00e1 usted satisfecha con su calidad de vida?",
            "en": "Are you satisfied with your quality of life?"
        },
        value: null,
        type: "blood_pressure",
        options: ""
    },
    {
        id: "DIF_ACT",
        escala: "ESTIL_VIDA",
        caract_form: "VIDA_P",
        tag: "3",
        order: 3,
        label: {
            "ca": "A causa de la meva endometriosi tinc dificultats per fer activitats quotidianes normals com, per exemple, anar de compres, conduir, tasques dom\u00e8stiques, cuinar, vestir-se, etc.",
            "es": "Debido a mi endometriosis tengo dificultades para realizar  actividades cotidianas normales como, por ejemplo, ir de compras, conducir, tareas dom\u00e9sticas, cocinar, vestirse, etc.",
            "en": "Due to my endometriosis, I have difficulties performing normal daily activities such as shopping, driving, household chores, cooking, dressing, etc."
        },
        value: null,
        type: "select",
        main_tag: null,
        depends_on: null,
        options: {
            "1": {
                "ca": "Cap dificultat",
                "es": "Ninguna dificultad",
                "en": "No difficulty"
            },
            "2": {
                "ca": "Algunes dificultats",
                "es": "Algunas dificultades",
                "en": "Some difficulty"
            },
            "3": {
                "ca": "For\u00e7a dificultats",
                "es": "Bastantes dificultades",
                "en": "Considerable difficulty"
            },
            "4": {
                "ca": "Moltes dificultats",
                "es": "Muchas dificultades",
                "en": "A lot of difficulty"
            },
            "5": {
                "ca": "Completament incapacitada \/ Necessito ajuda",
                "es": "Completamente incapacitada \/ Necesito ayuda",
                "en": "Completely incapacitated \/ Need help"
            }
        }
    },
    {
        id: "SALUD_ACTI",
        escala: "ESTIL_VIDA",
        caract_form: "VIDA_P",
        tag: "4",
        order: 4,
        label: {
            "ca": "En quina mesura la seva salut f\u00edsica i\/o els seus problemes emocionals interfereixen en les seves activitats i relacions socials i familars?",
            "es": "En qu\u00e9 medida su salud f\u00edsica y\/o sus problemas emocionales interfieren en sus actividades y  relaciones sociales y familiares",
            "en": "To what extent do your physical health and\/or emotional problems interfere with your activities and social and family relationships?"
        },
        value: null,
        type: "select",
        main_tag: null,
        depends_on: null,
        options: {
            "1": {
                "ca": "No interfereix",
                "es": "No interfiere",
                "en": "Doesn\u0027t interfere"
            },
            "2": {
                "ca": "Interfereix una mica",
                "es": "Interfiere un poco",
                "en": "Interferes a little"
            },
            "3": {
                "ca": "Interfereix for\u00e7a",
                "es": "Interfiere bastante",
                "en": "Interferes considerably"
            },
            "4": {
                "ca": "Interfereix molt",
                "es": "Interfiere mucho",
                "en": "Interferes a lot"
            },
            "5": {
                "ca": "L\u0027endometriosi m\u0027impedeix tenir activitats socials",
                "es": "La endometriosis me impide tener actividades sociales",
                "en": "Endometriosis prevents me from having social activities"
            }
        }
  }
  ];

}
