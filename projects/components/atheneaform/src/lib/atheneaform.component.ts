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
const SHOW_CONTINUE_BUTTON = ['pain', 'text', 'csi_multiple', 'info'];

const happyUrl = new URL("../assets/face-happy-svgrepo-com.svg", import.meta.url)
const neutralUrl = new URL("../assets/face-neutral-svgrepo-com.svg", import.meta.url)
const sadUrl = new URL("../assets/face-sad-svgrepo-com.svg", import.meta.url)
const humanBodyUrl = new URL("../assets/icons/human-body-outline.svg", import.meta.url)

@Component({
  selector: 'atheneaform',
  standalone: true,
  imports: [
    CommonModule,
    SwiperModule,
    IonicModule,
    FormsModule,
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
  @ViewChild('info') info!: TemplateRef<any>;
  @ViewChild('selectMood') selectMood!: TemplateRef<any>;
  @ViewChild('inputNum') inputNum!: TemplateRef<any>;
  @ViewChild('painLocation') painLocation!: TemplateRef<any>;

  @ViewChild('swiper') swiper!: SwiperComponent;
  @ViewChildren('scrollContainer') scrollContainers!: QueryList<ElementRef>;

  moods = [
    { value: 'happy',   icon: happyUrl.href, label: { en: 'Happy', es: 'Feliz', ca: 'Feliç' }, index : 0},
    { value: 'neutral', icon: neutralUrl.href, label: { en: 'Neutral', es: 'Neutral',  ca: 'Neutral'}, index : 1 },
    { value: 'sad',     icon: sadUrl.href, label: { en: 'Sad', es: 'Triste', ca: 'Trist' }, index : 2,  },
  ];
  humanBodyIcon = humanBodyUrl.href;



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

  // This will hold the identifier of the selected zone.
  selectedZone: string = '';
  zones: Zone[] = [
    { code: 'mama1', ordinary_name: 'Mama esquerra', formal_name: 'Mama esquerra' },
    { code: 'mama2', ordinary_name: 'Mama dreta',    formal_name: 'Mama dreta' },
    { code: 'pit',   ordinary_name: 'Pit',           formal_name: 'Pit' },
    { code: 'cap',   ordinary_name: 'Cap',           formal_name: 'Cap' },
    { code: 'panxa', ordinary_name: 'Panxa',         formal_name: 'Abdomen' },
    { code: 'genitals', ordinary_name: 'Genitals',   formal_name: 'Genitals' },
    { code: 'camafd', ordinary_name: 'Cama posterior dreta',   formal_name: 'Cama posterior dreta' },
    { code: 'camafe', ordinary_name: 'Cama posterior esquerra', formal_name: 'Cama posterior esquerra' },
    { code: 'camate', ordinary_name: 'Cama anterior esquerra', formal_name: 'Cama anterior esquerra' },
    { code: 'camatd', ordinary_name: 'Cama anterior dreta',  formal_name: 'Cama anterior dreta' },
    { code: 'zonaAnal', ordinary_name: 'Zona anal',         formal_name: 'Zona anal' },
    { code: 'partBaixaEsquena', ordinary_name: 'Part baixa de l\'esquena', formal_name: 'Part inferior de l\'esquena' },
    { code: 'braçe', ordinary_name: 'Braç esquerre',         formal_name: 'Braç esquerre' },
    { code: 'braçd', ordinary_name: 'Braç dret',             formal_name: 'Braç dret' },
    { code: 'general', ordinary_name: 'General',            formal_name: 'Cos general' },
    { code: 'tronc', ordinary_name: 'Tronc',                formal_name: 'Tronc corporal' }
  ];
  
  onZoneClick(index: number, zone_formal_name: string, zone_code: string, slide: boolean): void {
    this.selectedZone = zone_code;
    this.inputChange(index, zone_code, slide);
  }

  questionValueIsZero(id: string | null): boolean {
    if(id == null) return true;
    let question = this.questions.find(q => q.id === id);
    return question?.value == 0
  }

  shouldRenderQuestion(question: Question): boolean {
    // If there's a dependency, render only if the dependent question's value is not zero.
    if (question?.depends_on) {
      return !this.questionValueIsZero(question.depends_on);
    }
    // If it has a main tag, use the main tag logic.
    if (question?.main_tag) {
      return question.type === 'mult' ? false : this.isMainPositive(question.main_tag);
    }
    // Otherwise, always render.
    return true;
  }

  get visibleQuestionIndices(): number[] {
    const indices: number[] = [];
    this.questions.forEach((question, index) => {
      if (this.shouldRenderQuestion(question)) {
        indices.push(index);
      }
    });
    return indices;
  }
  
  
  

  constructor(
  ) { }

  async ngOnInit() {
    await this.checkSavedAnswers();

    let indexI = 0;
    let indexII = 0;
    let indexIII = 0;
    let mainTag = ''

    // Iterem sobre les questions, posant el tag corresponent
    for (let i = 1; i < this.questions.length+1; i++) {
      if(this.questions[i-1].type === 'info') {
        indexII = 0;
        indexIII = 0;
        if(indexI === 0) {
          indexI = i;
          this.questions[i-1].tag = `${indexI}`
        } else {
          indexI = indexI + 1
          this.questions[i-1].tag = `${indexI}`
        }
      } else if(indexIII !== 0) {
        if(this.questions[i-1].type === 'mult') {
          this.questions[i-1].tag = `${indexI}.${indexII}.${indexIII}`;
          this.questions[i-1].main_tag = mainTag;
          indexIII = indexIII + 1;
        } 
        else if(this.questions[i-1].depends_on) {
          indexIII = indexIII + 1;
          this.questions[i-1].tag = `${indexI}.${indexII}.${indexIII}`;
        }
        else {
          indexII = indexII + 1;
          this.questions[i-1].tag = `${indexI}.${indexII}`;
          indexIII = 0
        }
      } else if(indexI !== 0) {
        indexII = indexII + 1;
        this.questions[i-1].tag = `${indexI}.${indexII}`;
        if(this.questions[i-1].type === 'csi_multiple') {
          indexIII = 1;
          mainTag = `${indexI}.${indexII}`;
        } else if(this.questions[i-1].depends_on) {
          indexII = indexII - 1;
          indexIII = 1;
          this.questions[i-1].tag = `${indexI}.${indexII}.${indexIII}`;
        }
      } 
    }

    // Iterem sobre les questions per posar quina és la capçalera
    let headform = ''
    for (let i = 0; i < this.questions.length; i++) {
      if(this.questions[i].type === 'info') {
        headform = this.questions[i].info?.subtitle[this.selectedLang] ?? ''
      } else {
        if (headform != '') {
          this.questions[i].headform = headform;
        }
      }
    }

    // Iterem sobre les questions per posar el contador de preguntes sobre la pantalla info
    let max_questions = 0;
    let min_questions = 0;
    for (let i = this.questions.length-1; i >= 0; i--) {
      if(this.questions[i].type === 'info') {
        this.questions[i].max_questions = max_questions;
        this.questions[i].min_questions = min_questions;
        max_questions = 0;
        min_questions = 0;
      } else {
        max_questions = max_questions + 1;
        if(!this.questions[i].depends_on) min_questions = min_questions + 1;
      }
    }



    this.questions.forEach((question, index) => {
      if (question.type == SKIP_CHECK_TYPE) this.multMap[question.tag as any] = [];
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

  getColSize(index: number): number {
    const totalColumns = 12;
    const count = this.moods.length;
    const baseSize = Math.floor(totalColumns / count);
    return baseSize;
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
      case 'info':
        return this.info;
      case 'select_mood':
        return this.selectMood;
      case 'input_num':
        return this.inputNum
      case 'pain_location':
        return this.painLocation; 
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

      // Trigger the slide animation.
  this.swiper.swiperRef.slideNext(250);

  // Get the visible questions mapping.
  const visibleIndices = this.visibleQuestionIndices;

  // Adjust the index if you're using a preview slide.
  const adjustedSlideIndex = this.preview ? this.slideIndex - 1 : this.slideIndex;
  
  // Make sure we have a valid mapping.
  if (adjustedSlideIndex >= 0 && adjustedSlideIndex < visibleIndices.length) {
    const actualQuestionIndex = visibleIndices[adjustedSlideIndex];
    let question = this.questions[actualQuestionIndex];

    if (question.optional) {
      this.showContinueButton();
    } else {
      this.hideContinueButton();
    }

    console.log(question, this.slideIndex, this.questions);
  }

    // let question = this.questions[(this.preview ? this.slideIndex-1 : this.slideIndex)];
    // if (question.optional) this.showContinueButton();
    // else this.hideContinueButton();

    // console.log(question, this.slideIndex, this.questions)

    if (this.isEnd) 
      setTimeout(() => { 
        this.hasReachedEnd = true;
      }, 250);
  }

  slidePrevious() {
    this.swiper.swiperRef.slidePrev(250);
    
    // Get the current mapping of visible question indices
    const visibleIndices = this.visibleQuestionIndices;
    
    // Adjust slideIndex for preview (if applicable)
    const adjustedSlideIndex = this.preview ? this.slideIndex - 1 : this.slideIndex;
    
    if (adjustedSlideIndex >= 0 && adjustedSlideIndex < visibleIndices.length) {
      const actualQuestionIndex = visibleIndices[adjustedSlideIndex];
      const question = this.questions[actualQuestionIndex];
      
      if (question.optional) {
        this.showContinueButton();
      } else {
        this.hideContinueButton();
      }
    }
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

type Type = 'number' | 'select' | 'text' | 'pain' | 'csi_multiple' | 'mult' | 'info' | 'select_mood' | 'input_num' | 'pain_location';
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
  info: Info | null;
  units: string | null;
  max_questions: number | null;
  min_questions: number | null;
  headform: string | null;
  depends_on: string | null;
};

export interface Info {
  subtitle: Multilang;
  desc_html: Multilang;
}

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

export interface Zone {
  code: string;
  ordinary_name: string;
  formal_name: string;
}
