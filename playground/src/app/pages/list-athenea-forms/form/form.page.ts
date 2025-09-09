import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { EnviamentService } from 'src/services/enviament.service';
import { NavController } from '@ionic/angular';
import { FormService } from 'src/services/forms.service';
import { Preferences } from '@capacitor/preferences';

type Answer = { ID: string; VALOR: string | number };
type AnswersEnvelope = { answers: Answer[]; progress: number };

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {
  
  enviamentId: string | null = '';
  id: string = 'test';
  questions: any[] = [];
  title = '';
  lang: any = 'ca';
  preview: any;
  canAnswer = true;
  end: any = { ca: 'ca', es: 'es', en: 'en' };
  availableDate: Date = new Date();
  answersId: string = 'id';
  useLocalStorage = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService,
    public envimentService: EnviamentService,
    private formService: FormService,
    private navCtrl: NavController
  ) {}


async getJSON<T>(key: string): Promise<T | null> {
  const { value } = await Preferences.get({ key });
  if (!value) return null;
  try { return JSON.parse(value) as T; }
  catch { console.warn(`Valor en ${key} no es JSON válido`); return null; }
}

ngOnInit() {
  const qp = this.route.snapshot.queryParamMap;
   const qpTitle = qp.get('title');
  if (qpTitle) {
    this.title = qpTitle;
  }

  const id = this.route.snapshot.paramMap.get('id');

  if (id) this.id = id;

  const st: any =
    this.router.getCurrentNavigation()?.extras?.state   
    ?? null;                                  
  if (st?.preview) {
    try { this.preview = JSON.parse(st.preview); } catch {}
  }

    if (st?.enviamentId) this.enviamentId = st.enviamentId;

    // TODO: no se usa el end, borrarlo?
  if (st?.end) this.end = st.end;
  if (st?.availableDate) this.availableDate =  new Date(st.availableDate)
  if (st?.answersId) this.answersId = st.answersId;
  if (st?.useLocalStorage) this.useLocalStorage = st.useLocalStorage;
  if (st?.questions) this.questions = st.questions;
}

async send() {
  try {
    this.envimentService.markFormAsResponded(this.id!);

    const [{ value: idEnviament }, { value: idUser }, { value: role }] = await Promise.all([
      Preferences.get({ key: 'id_enviament' }),
      Preferences.get({ key: 'id_user' }),
      Preferences.get({ key: 'role' }),
    ]);

    const answersEnvelope = await this.getJSON<AnswersEnvelope>('id');
    const answers = (answersEnvelope?.answers ?? []).map(a => ({ ...a, VALOR: Number(a.VALOR) }));

    const data = {
      enviament_id: idEnviament ?? this.enviamentId,
      form_id: this.id,
      user_id: idUser ?? '',
      role: role ?? '',
      answers
    };

    await this.formService.updateEnviament(data);

    setTimeout(() => this.navCtrl.back(), 500);
  } catch (e) {
    console.error(e);
  }
}

}