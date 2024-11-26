import { AlertController, IonicModule, ModalController, RangeCustomEvent } from '@ionic/angular';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent, SwiperModule } from 'swiper/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';
const TIMEOUT_TIME = 350;
const SI_VAL = '1';
const SKIP_CHECK_TYPE = 'csi_multiple';
const SHOW_CONTINUE_BUTTON = ['pain', 'text', 'csi_multiple'];

@Component({
  selector: 'atheneaform',
  standalone: true,
  imports: [
    CommonModule,
    SwiperModule,
    IonicModule,
    FormsModule
  ],
  templateUrl: './form-component/form.component.html',
  styleUrl: './form-component/form.component.scss'
})
export class AtheneaformComponent implements AfterViewChecked {

  @Input() questions: Question[] = [];
  @Input() title: string | null = null;
  @Input() set lang(val: Lang){
    this.checkHasLang(val ?? 'ca');
  };
  @Output() sendSurvey:EventEmitter<any> = new EventEmitter<any>();
  //PREVIEW
  @Input() preview: Preview | null = null;
  @Input() end: Multilang | null = null;
  @Input() canAnswer: boolean = true;
  @Input() availableDate: Date | null = null;
  @Input() answersId!: string;

  @ViewChild('numberSelector') numberSelector!: TemplateRef<any>;
  @ViewChild('txtSelector') txtSelector!: TemplateRef<any>;
  @ViewChild('select') select!: TemplateRef<any>;
  @ViewChild('painSelector') pain!: TemplateRef<any>;
  @ViewChild('diagnosisMultiple') multiple!: TemplateRef<any>;
  
  @ViewChild('swiper') swiper!: SwiperComponent;
  @ViewChildren('scrollContainer') scrollContainers!: QueryList<ElementRef>;

  config: SwiperOptions = {
    direction: 'vertical',
    slidesPerView: 1, // Show only one slide at a time
    allowTouchMove: false, // Allow manual swipe between slides
    pagination: {
      // el: 'form-progressbar',
      enabled: true,
      type: 'progressbar',
      progressbarOpposite: false
    },
    effect: 'slide', // You can use 'fade' for a fade effect
    speed: 600, // Smooth transition speed
    preventInteractionOnTransition: true, // Prevent interaction while sliding
  }

  loading:boolean = false;
  hasScroll: any[] = [];
  /**
   * Array that contains questionID(key) and subquestionsIndex(value)
   */
  multMap: any[] = [];

  slideIndex: number = 0;
  isCompleted: Boolean = false;
  hasReachedEnd: Boolean = false;
  continueButton: Boolean = false;
  selectedLang: Lang = 'ca';
  lastIndex: number | null = null;

  constructor(
  ) { }

  async ngOnInit() {
    await this.checkSavedAnswers();
    this.questions.forEach((question, index) => {
      if (question.type == SKIP_CHECK_TYPE) this.multMap[question.id as any] = [];
      else if (question.type == 'mult') {
        if (question.main_tag) this.multMap[question.main_tag as any].push(index);
      }
    });
  }

  ngAfterViewChecked(): void {
    this.scrollContainers.changes.subscribe(() => {
      setTimeout(() => {
        this.scrollContainers.forEach((scrollContainer: ElementRef, index: number) => {
          const element = scrollContainer.nativeElement;
          const isScrollable = element.scrollHeight > element.clientHeight;
          if (isScrollable) this.hasScroll.push(index);
        });
      }, 500);
    });
  }

  saveSurvey() {
    if (!this.canAnswer) return;
    if (this.formHasErrors(true)) return;

    let questRet = [];
    for (let index = 0; index < this.questions.length; index++) {
      if (this.questions[index].type == 'text' && this.questions[index].value == '-') this.questions[index].value = ''; 
      const element = this.questions[index];
      if (element.type != SKIP_CHECK_TYPE) questRet.push(element);
    }

    this.sendSurvey.emit({
      "questions": questRet,
      "role": 'send'
    });
  }

  formHasErrors(slide = false): Boolean {
    for (let index = 0; index < this.questions.length; index++) {
      const elem = this.questions[index];
      if (elem.optional) continue;
      if (elem.value == null && elem.type != SKIP_CHECK_TYPE) {
        if (elem?.main_tag) {
          if (this.isMainPositive(elem.main_tag)) {
            if (slide) this.slideTo(index);
            return true;
          }
        }
        else {
          if (slide) this.slideTo(index);
          return true;
        }
      }
    }
    return false;
  }

  cancel() {
    this.sendSurvey.emit({
      "role": 'close'
    });
  }

  getType(type: string) {
    switch (type) {
      case 'number':
        return this.numberSelector;   
      case 'select':
        return this.select;   
      case 'pain':
        return this.pain;   
      case SKIP_CHECK_TYPE:
        return this.multiple;
      default:
        return this.txtSelector;
    }
  }

  isMainPositive(mainTag: string | null) {
    if (mainTag) {
      let question = this.getQuestion(mainTag);
      //NO és ópitm
      if (question && question.type == SKIP_CHECK_TYPE) return true;
      if (question && question.value == SI_VAL) return true;
    }
    
    return false;
  }

  getQuestion(tag: string) {
    return this.questions.find(obj => {
      return obj.id === tag;
    });
  }

  slideNext(save: boolean = false) {
    if (save) this.saveAnswers();

    this.swiper.swiperRef.slideNext(250);

    let question = this.questions[(this.preview ? this.slideIndex-1 : this.slideIndex)];
    if (question.optional) this.showContinueButton();
    else this.hideContinueButton();

    if (this.isEnd) 
      setTimeout(() => { 
        this.hasReachedEnd = true;
      }, 250);
  }

  slidePrevious() {
    this.swiper.swiperRef.slidePrev(250);
    this.hideContinueButton();
  }

  slideTo(index: number, speed: number = 100) {
    this.swiper.swiperRef.slideTo(this.preview ? index+1 : index, speed);
  }

  onSlideChange(e: any) {
    this.slideIndex = e[0]?.activeIndex;
  }

  get isBegining() {
    return this.swiper?.swiperRef.isBeginning;
  }
  get isEnd() {
    return this.swiper?.swiperRef.isEnd;
  }

  get canContinue() {
    //Si final swiper no continua
    if (this.swiper?.swiperRef.isEnd) return false;
    if (!this.canAnswer) return true;
    //Si pregunta contestada pot continuar, sinó no
    let question = this.questions[this.preview ? this.slideIndex-1 : this.slideIndex]
    if (this.preview && this.slideIndex == 0) return true;
    else if (question.optional || question.value != null) return true;
    else if (question.type == 'csi_multiple') return this.multValue(question.id);
    return false;
  }

  inputChange(index: number, e: any = null, slide: boolean = true, valNul: boolean = false) {
    //Assignem valor
    if (e && !valNul) this.questions[index].value = e;
    else if (valNul) {
      this.questions[index].value = null;
      this.hideContinueButton();
    }

    this.saveAnswers();

    if (slide)
    setTimeout(() => {
      this.slideNext();
    }, TIMEOUT_TIME);
    else {
      if (this.questions[index].type == 'mult') {
        if (this.multValue(this.questions[index].main_tag)) this.showContinueButton();
      }
      else if (!valNul) this.showContinueButton();
    }

    if (!this.formHasErrors()) this.isCompleted = true;
    else this.isCompleted = false;

  }

  multValue(tag: any): boolean {
    let map = this.multMap[tag];
    let canCont = true;
    map.forEach((key: any, value: any) => {
      if (this.questions[key].value == null) canCont = false;
    });
    return canCont;
  }

  scrollBottom(index: number) {
    const elem = this.getNativeElem(index);
    // const elem = (this.scrollContainers.get(index))?.nativeElement;
    elem.scrollTo({
      top: elem.scrollHeight, // Scroll to the bottom of the element
      behavior: 'smooth' // Enable smooth scrolling
    });
  }

  checkScroll(index: number) {
    const element = this.scrollContainers.get(index)?.nativeElement;
    if (element) {
      const isScrolledToBottom = element.scrollTop + element.clientHeight >= element.scrollHeight -1;
      if (isScrolledToBottom) this.hasScroll.splice(this.hasScroll.indexOf(index), 1);
    }
  }

  getNativeElem(index: number) {
    return (this.scrollContainers.get(index))?.nativeElement;
  }

  divideOption(option: any, index: 0 | 1) {
    if (option) return (option.split(':'))[index];
    return null;
  }

  showContinueButton() {
    this.continueButton = true;
  }
  hideContinueButton() {
    this.continueButton = false;
  }

  checkHasLang(lang: Lang, toCheck: Array<string> = ['ca', 'es', 'en']) {
    let label = this.questions[0].label[lang];
    if (label && label.trim() != "") this.selectedLang = lang;
    else {
      toCheck.splice(toCheck.indexOf(lang), 1);
      if (toCheck.length == 0) 
        this.sendSurvey.emit({
          "questions": null,
          "role": 'error'
        });

      this.checkHasLang(toCheck[0] as Lang, toCheck);
    }
  }

  async saveAnswers() {
    let answers = await this.questions.filter(function(obj) {
      return obj.value != null;
    }).map(elem => ({
      ID: elem?.id,
      VALOR: elem?.value
    }));

    let progress = Math.round((answers.length*100)/this.questions.length);

    Preferences.set({key: this.answersId, value: JSON.stringify({
      "answers": answers,
      "progress": progress
    })});
  }

  async checkSavedAnswers() {
    if (!this.answersId) return;
    let preference = (await Preferences.get({key: this.answersId})).value;
    if (!preference) return;
    let answers = JSON.parse(preference);

    if (answers)
    await answers.answers.forEach((answer: any) => {
      const index = this.questions.findIndex(question => {
        return question.id == answer.ID
      })
      // const index = this.questions.map(function (e) {
      //   return e.id;
      // }).indexOf(element.ID);
      if (index >= 0) {
        this.questions[index].value = answer.VALOR;
        this.lastIndex = index;
      }
    });
  }

  slideLastAnswered() {
    this.slideTo(this.lastIndex??0+1, 500);
    this.lastIndex = null;
  }

}

type Type = 'number' | 'select' | 'text' | 'pain' | 'csi_multiple' | 'mult';
type Lang = 'ca' | 'es' | 'en';
export interface Question {
  id: string;
  tag: string | null;
  order: number | string;
  label: Multilang;
  value: string | number | null;
  type: Type;
  options: Record<string, Multilang> | null | string | Array<any>;
  main_tag: string | null;
  escala: string | null;
  caract_form: string | null;
  optional: boolean;
};

export interface Multilang {
  ca: string;
  es: string;
  en: string;
}

export interface Preview {
  title: string | null;
  subtitle: string | null;
  desc_html: string | null;
  button: string;
}