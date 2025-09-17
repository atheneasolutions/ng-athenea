import {
  AlertController,
  IonicModule,
  ModalController,
  RangeCustomEvent,
} from '@ionic/angular';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent, SwiperModule } from 'swiper/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';
import { HdomComponentsModule } from './hdom/components/hdom-components.module';
import { InputValidationService } from './hdom/services/input-validation.service';

const TIMEOUT_TIME = 350;
const SI_VAL = '1';
const SKIP_CHECK_TYPE = 'csi_multiple';
const SHOW_CONTINUE_BUTTON = ['pain', 'text', 'csi_multiple', 'info'];
const CONSTANT_TYPES = [
  'blood_glucose',
  'blood_pressure',
  'heart_rate',
  'scale',
  'thermometer',
  'heart',
];

@Component({
  selector: 'atheneaform',
  standalone: true,
  imports: [
    CommonModule,
    SwiperModule,
    IonicModule,
    FormsModule,
    HdomComponentsModule,
  ],
  templateUrl: './form-component/form.component.html',
  styleUrl: './form-component/form.component.scss',
})
export class AtheneaformComponent implements AfterViewChecked {
  @Input() questions: Question[] = [];
  @Input() title: string | null = null;
  @Input() set lang(val: Lang) {
    this.checkHasLang(val ?? 'ca');
  }
  @Output() sendSurvey: EventEmitter<any> = new EventEmitter<any>();
  //PREVIEW
  @Input() preview: Preview | null = null;
  @Input() end: Multilang | null = null;
  @Input() canAnswer: boolean = true;
  @Input() availableDate: Date | null = null;
  @Input() answersId!: string;
  @Input() id!: string;
  @Input() useLocalStorage: boolean = true;
  @Input() useBackgroundImage: boolean = false;
  @Input() assetBase = 'assets/swiper-form'; // valor por defecto que coincide con el glob

  @ViewChild('numberSelector') numberSelector!: TemplateRef<any>;
  @ViewChild('txtSelector') txtSelector!: TemplateRef<any>;
  @ViewChild('select') select!: TemplateRef<any>;
  @ViewChild('painSelector') pain!: TemplateRef<any>;
  @ViewChild('painPati') painPati!: TemplateRef<any>;
  @ViewChild('diagnosisMultiple') multiple!: TemplateRef<any>;
  @ViewChild('info') info!: TemplateRef<any>;
  @ViewChild('selectMood') selectMood!: TemplateRef<any>;
  @ViewChild('inputNum') inputNum!: TemplateRef<any>;
  @ViewChild('inputText') inputText!: TemplateRef<any>;
  @ViewChild('painLocation') painLocation!: TemplateRef<any>;
  @ViewChild('painLocationPati') painLocationPati!: TemplateRef<any>;

  @ViewChild('bloodGlucose') bloodGlucose!: TemplateRef<any>;
  @ViewChild('bloodPressure') bloodPressure!: TemplateRef<any>;
  @ViewChild('heartRate') heartRate!: TemplateRef<any>;
  @ViewChild('scale') scale!: TemplateRef<any>;
  @ViewChild('thermometer') thermometer!: TemplateRef<any>;
  @ViewChild('heart') heart!: TemplateRef<any>;

  @ViewChild('swiper') swiper!: SwiperComponent;
  @ViewChildren('scrollContainer') scrollContainers!: QueryList<ElementRef>;
  private icon(name: string) { return `${this.assetBase}/${name}`; }

  backgroundImageUrl = this.icon('background-tauli.png');

  painLocationNumbersFront = [
      { index: 1, code: 'frontDalt' },
      { index: 2, code: 'frontBaix' },
      { index: 3, code: 'collEsquerra' },
      { index: 4, code: 'collDret' },
      { index: 5, code: 'espatllaDreta' },
      { index: 6, code: 'pectoralDret' },
      { index: 7, code: 'pectoralEsquerre' },
      { index: 8, code: 'espatllaEsquerra' },
      { index: 9, code: 'braçDret' },
      { index: 10, code: 'abdomenSuperiorDret' },
      { index: 11, code: 'abdomenSuperiorEsquerre' },
      { index: 12, code: 'braçEsquerre' },
      { index: 13, code: 'maDreta' },
      { index: 14, code: 'abdomenInferiorDret' },
      { index: 15, code: 'abdomenInferiorEsquerre' },
      { index: 16, code: 'maEsquerra' },
      { index: 17, code: 'cuixaDreta' },
      { index: 18, code: 'cuixaEsquerra' },
      { index: 19, code: 'camaDreta' },
      { index: 20, code: 'camaEsquerra' },
      { index: 21, code: 'peuDret' },
      { index: 22, code: 'peuEsquerra' }
    ];
painLocationNumbersBack = [
    { index: 1, code: 'capDretPosterior' },
    { index: 2, code: 'capEsquerrePosterior' },
    { index: 3, code: 'clatell' },
    { index: 4, code: 'collPosterior' },
    { index: 5, code: 'espatllaDretaPosterior' },
    { index: 6, code: 'esquenaAltaDreta' },
    { index: 7, code: 'esquenaAltaEsquerra' },
    { index: 8, code: 'espatllaEsquerraPosterior' },
    { index: 9, code: 'braçDretPosterior' },
    { index: 10, code: 'esquenaMitjaDreta' },
    { index: 11, code: 'esquenaMitjaEsquerra' },
    { index: 12, code: 'braçEsquerrePosterior' },
    { index: 13, code: 'maDretaPosterior' },
    { index: 14, code: 'llomDret' },
    { index: 15, code: 'llomEsquerre' },
    { index: 16, code: 'maEsquerraPosterior' },
    { index: 17, code: 'gluti' },
    { index: 18, code: 'cuixaPosterior' },
    { index: 19, code: 'camaEsquerraPosterior' },
    { index: 20, code: 'camaDretaPosterior' },
    { index: 21, code: 'talóDret' },
    { index: 22, code: 'talóEsquerre' }
  ];
  


  moods = [
    {
      value: 'happy',
      icon: this.icon('face-happy-svgrepo-com.svg'),
      label: { en: 'Happy', es: 'Feliz', ca: 'Feliç' },
      index: 0,
    },
    {
      value: 'neutral',
      icon: this.icon('face-neutral-svgrepo-com.svg'),
      label: { en: 'Neutral', es: 'Neutral', ca: 'Neutral' },
      index: 1,
    },
    {
      value: 'sad',
      icon: this.icon('face-sad-svgrepo-com.svg'),
      label: { en: 'Sad', es: 'Triste', ca: 'Trist' },
      index: 2,
    },
  ];

  humanBodyFrontImage = this.icon('human-body-front.png');
  humanBodyBackImage = this.icon('human-body-back.png');


  painColors = ["sin","muyleve","muyleve2","leve","leve2","moderado","moderado2","severo","severo2","insoportable","insoportable2"];


  painIcons = [
    { 
      icon: this.icon('face-happy-svgrepo-com.svg'),
      index: 0,
      colorClass: "sin"
    },
    {  
      icon: this.icon('face-happy-svgrepo-com.svg'),
      index: 1,
      colorClass: "muyleve"
    },
    {
      icon: this.icon('face-neutral-svgrepo-com.svg'),
      index: 2,
      colorClass: "leve2"
    },
    { 
      icon: this.icon('face-neutral-svgrepo-com.svg'),
      index: 0,
      colorClass: "moderado"
    },
    {  
      icon: this.icon('face-sad-svgrepo-com.svg'),
      index: 1,
      colorClass: "severo"
    },
    {
      icon: this.icon('face-sad-svgrepo-com.svg'),
      index: 2,
      colorClass: "insoportable"
    },
     {
      icon: this.icon('face-sad-svgrepo-com.svg'),
      index: 2,
      colorClass: "insoportable2"
    },
  ];


  config: SwiperOptions = {
    direction: 'vertical',
    slidesPerView: 1, // Show only one slide at a time
    allowTouchMove: false, // Allow manual swipe between slides
    pagination: {
      // el: 'form-progressbar',
      enabled: true,
      type: 'progressbar',
      progressbarOpposite: false,
    },
    effect: 'slide', // You can use 'fade' for a fade effect
    speed: 600, // Smooth transition speed
    preventInteractionOnTransition: true, // Prevent interaction while sliding
  };

  loading: boolean = false;
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
    {
      code: 'general',
      ordinary_name: { ca: 'General', es: 'General', en: 'General' },
      formal_name: { ca: 'General', es: 'General', en: 'General' },
    },
    {
      code: 'tronc',
      ordinary_name: { ca: 'Tronc', es: 'Tronco', en: 'Trunk' },
      formal_name: { ca: 'Torso', es: 'Torso', en: 'Torso' },
    },
    {
      code: 'braçDret',
      ordinary_name: { ca: 'Braç dret', es: 'Brazo derecho', en: 'Right arm' },
      formal_name: { ca: 'Braç dret', es: 'Brazo derecho', en: 'Right arm' },
    },
    {
      code: 'braçEsquerra',
      ordinary_name: {
        ca: 'Braç esquerre',
        es: 'Brazo izquierdo',
        en: 'Left arm',
      },
      formal_name: {
        ca: 'Braç esquerre',
        es: 'Brazo izquierdo',
        en: 'Left arm',
      },
    },
    {
      code: 'cap',
      ordinary_name: { ca: 'Cap', es: 'Cabeza', en: 'Head' },
      formal_name: { ca: 'Cefàlic', es: 'Cefálico', en: 'Cephalic' },
    },
    {
      code: 'camaAnteriorEsquerra',
      ordinary_name: {
        ca: 'Cama anterior esquerra',
        es: 'Pierna anterior izquierda',
        en: 'Front left leg',
      },
      formal_name: {
        ca: 'Cama anterior esquerra',
        es: 'Pierna anterior izquierda',
        en: 'Front left leg',
      },
    },
    {
      code: 'camaAnteriorDreta',
      ordinary_name: {
        ca: 'Cama anterior dreta',
        es: 'Pierna anterior derecha',
        en: 'Front right leg',
      },
      formal_name: {
        ca: 'Cama anterior dreta',
        es: 'Pierna anterior derecha',
        en: 'Front right leg',
      },
    },
    {
      code: 'camaPosteriorEsquerra',
      ordinary_name: {
        ca: 'Cama posterior esquerra',
        es: 'Pierna posterior izquierda',
        en: 'Back left leg',
      },
      formal_name: {
        ca: 'Cama posterior esquerra',
        es: 'Pierna posterior izquierda',
        en: 'Back left leg',
      },
    },
    {
      code: 'camaPosteriorDreta',
      ordinary_name: {
        ca: 'Cama posterior dreta',
        es: 'Pierna posterior derecha',
        en: 'Back right leg',
      },
      formal_name: {
        ca: 'Cama posterior dreta',
        es: 'Pierna posterior derecha',
        en: 'Back right leg',
      },
    },
    {
      code: 'genitals',
      ordinary_name: { ca: 'Genitals', es: 'Genitales', en: 'Genitals' },
      formal_name: { ca: 'Genitals', es: 'Genitales', en: 'Genitals' },
    },
    {
      code: 'mamaDreta',
      ordinary_name: {
        ca: 'Mama dreta',
        es: 'Mama derecha',
        en: 'Right breast',
      },
      formal_name: { ca: 'Mama dreta', es: 'Mama derecha', en: 'Right breast' },
    },
    {
      code: 'mamaEsquerra',
      ordinary_name: {
        ca: 'Mama esquerra',
        es: 'Mama izquierda',
        en: 'Left breast',
      },
      formal_name: {
        ca: 'Mama esquerra',
        es: 'Mama izquierda',
        en: 'Left breast',
      },
    },
    {
      code: 'panxa',
      ordinary_name: { ca: 'Panxa', es: 'Barriga', en: 'Belly' },
      formal_name: { ca: 'Abdomen', es: 'Abdomen', en: 'Abdomen' },
    },
    {
      code: 'partBaixaEsquena',
      ordinary_name: {
        ca: "Part baixa de l'esquena",
        es: 'Parte baja de la espalda',
        en: 'Lower back',
      },
      formal_name: { ca: 'Lumbar', es: 'Lumbar', en: 'Lumbar' },
    },
    {
      code: 'pit',
      ordinary_name: { ca: 'Pit', es: 'Pecho', en: 'Chest' },
      formal_name: { ca: 'Tòrax', es: 'Tórax', en: 'Thorax' },
    },
    {
      code: 'zonaAnal',
      ordinary_name: { ca: 'Zona anal', es: 'Zona anal', en: 'Anal area' },
      formal_name: { ca: 'Periné', es: 'Perineo', en: 'Perineum' },
    },
  ];

  isConstantInputValid: boolean = false;

  onConstantInputValidChange(
    index: number,
    { value, valid }: { value: string; valid: boolean }
  ) {
    this.isConstantInputValid = valid;
    if (this.isConstantInputValid) {
      this.inputChange(index, value, false);
      this.showContinueButton();
    } else {
      this.hideContinueButton();
    }
  }

  getTagWithDot(tag: string): string {
    if (!tag.includes('.')) {
      return tag + '.';
    }
    return tag;
  }

  constructor(public validator: InputValidationService) {}

  onBloodPressureInputValidChange(
    index: number,
    { BloodPreasure, valid }: { BloodPreasure: BloodPreasure; valid: boolean }
  ) {
    this.isConstantInputValid = valid;
    if (this.isConstantInputValid) {
      this.inputChange(index, BloodPreasure, false);
      this.showContinueButton();
    } else {
      this.hideContinueButton();
    }
  }
  

  onZoneClick(index: number, zone_code: string, slide: boolean): void {
    this.selectedZone = zone_code;
    this.inputChange(index, zone_code, slide);
  }

  setBackgroundImage(url: string) {
    this.backgroundImageUrl = url;
    this.useBackgroundImage = true;
  }

  clearBackgroundImage() {
    this.backgroundImageUrl = '';
    this.useBackgroundImage = false;
  }

  questionValueIsZero(id: string | null): boolean {
    if (id == null) return true;
    let question = this.questions.find((q) => q.id === id);
    return question?.value == 0;
  }

  shouldRenderQuestion(question: Question): boolean {
    // If there's a dependency, render only if the dependent question's value is not zero.
    if (question?.depends_on) {
      return !this.questionValueIsZero(question.depends_on);
    }
    // If it has a main tag, use the main tag logic.
    if (question?.main_tag) {
      return question.type === 'mult'
        ? false
        : this.isMainPositive(question.main_tag);
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

  getBloodPressure(index: number): BloodPreasure {
  const question = this.questions[index];

  if (question.type !== 'pain_location_pati' && question.value && typeof question.value === 'object' && 'dia_value' in question.value) {
    return {
      dia_value: question.value.dia_value ?? '',
      sys_value: question.value.sys_value ?? '',
      bpm_value: question.value.bpm_value ?? '',
    };
  }

    return { dia_value: '', sys_value: '', bpm_value: '' };
  }

  isZoneSelected(index: number, code: string): boolean {
    const val =  this.questions[index].value;  

    if (Array.isArray(val)) {
      return val.includes(code);
    }
    return val === code;
  }

  getString(value: string | number | string[]| BloodPreasure | null ): string {
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number') {
      return '' + value + '';
    }
    return '';
  }

  async ngOnInit() {
    await this.checkSavedAnswers();

    let indexI = 0;
    let indexII = 0;
    let indexIII = 0;
    let mainTag = '';

    // Iterem sobre les questions, posant el tag corresponent
    for (let i = 1; i < this.questions.length + 1; i++) {
      if (this.questions[i - 1].type === 'info') {
        indexII = 0;
        indexIII = 0;
        if (indexI === 0) {
          indexI = i;
          this.questions[i - 1].tag = `${indexI}`;
        } else {
          indexI = indexI + 1;
          this.questions[i - 1].tag = `${indexI}`;
        }
      } else if (indexIII !== 0) {
        if (this.questions[i - 1].type === 'mult') {
          this.questions[i - 1].tag = `${indexI}.${indexII}.${indexIII}`;
          this.questions[i - 1].main_tag = mainTag;
          indexIII = indexIII + 1;
        } else if (this.questions[i - 1].depends_on) {
          indexIII = indexIII + 1;
          this.questions[i - 1].tag = `${indexI}.${indexII}.${indexIII}`;
        } else {
          indexII = indexII + 1;
          this.questions[i - 1].tag = `${indexI}.${indexII}`;
          indexIII = 0;
        }
      } else if (indexI !== 0) {
        indexII = indexII + 1;
        this.questions[i - 1].tag = `${indexI}.${indexII}`;
        if (this.questions[i - 1].type === 'csi_multiple') {
          indexIII = 1;
          mainTag = `${indexI}.${indexII}`;
        } else if (this.questions[i - 1].depends_on) {
          indexII = indexII - 1;
          indexIII = 1;
          this.questions[i - 1].tag = `${indexI}.${indexII}.${indexIII}`;
        }
      } else {
        this.questions[i - 1].tag = `${i}`;
      }
    }

    // Iterem sobre les questions per posar quina és la capçalera
    let headform = '';
    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions[i].type === 'info') {
        headform = this.questions[i].info?.subtitle[this.selectedLang] ?? '';
      } else {
        if (headform != '') {
          this.questions[i].headform = headform;
        }
      }
    }

    // Iterem sobre les questions per posar el contador de preguntes sobre la pantalla info
    let max_questions = 0;
    let min_questions = 0;
    for (let i = this.questions.length - 1; i >= 0; i--) {
      if (this.questions[i].type === 'info') {
        this.questions[i].max_questions = max_questions;
        this.questions[i].min_questions = min_questions;
        max_questions = 0;
        min_questions = 0;
      } else {
        max_questions = max_questions + 1;
        if (!this.questions[i].depends_on) min_questions = min_questions + 1;
      }
    }

    this.questions.forEach((question, index) => {
      if (question.type == SKIP_CHECK_TYPE)
        this.multMap[question.tag as any] = [];
      else if (question.type == 'mult') {
        if (question.main_tag)
          this.multMap[question.main_tag as any].push(index);
      }
    });
  }

  ngAfterViewChecked(): void {
    this.scrollContainers.changes.subscribe(() => {
      setTimeout(() => {
        this.scrollContainers.forEach(
          (scrollContainer: ElementRef, index: number) => {
            const element = scrollContainer.nativeElement;
            const isScrollable = element.scrollHeight > element.clientHeight;
            if (isScrollable) this.hasScroll.push(index);
          }
        );
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
      if (
        this.questions[index].type == 'text' &&
        this.questions[index].value == '-'
      )
        this.questions[index].value = '';
      const element = this.questions[index];
      if (element.type != SKIP_CHECK_TYPE && element.type != 'info')
        questRet.push(element);
    }

    this.sendSurvey.emit({
      id: this.id,
      questions: questRet,
      role: 'send',
    });
  }

  formHasErrors(slide = false): Boolean {
    for (let index = 0; index < this.questions.length; index++) {
      const elem = this.questions[index];
      if (elem.optional) continue;
      if (elem.depends_on && this.questionValueIsZero(elem.depends_on))
        continue;
      if (elem.value == null && elem.type != SKIP_CHECK_TYPE) {
        if (elem?.main_tag) {
          if (this.isMainPositive(elem.main_tag)) {
            if (slide) this.slideTo(index);
            return true;
          }
        } else {
          if (slide) this.slideTo(index);
          return true;
        }
      }
    }
    return false;
  }

  cancel() {
    this.sendSurvey.emit({
      role: 'close',
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
      case 'pain_pati':
        return this.painPati;
      case 'info':
        return this.info;
      case 'select_mood':
        return this.selectMood;
      case 'input_num':
        return this.inputNum;
      case 'input_text':
        return this.inputText;
      case 'pain_location':
        return this.painLocation;
      case 'pain_location_pati':
        return this.painLocationPati;
      case 'blood_glucose':
        return this.bloodGlucose;
      case 'blood_pressure':
        return this.bloodPressure;
      case 'heart_rate':
        return this.heartRate;
      case 'scale':
        return this.scale;
      case 'thermometer':
        return this.thermometer;
      case 'heart':
        return this.heart;
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
    return this.questions.find((obj) => {
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
    const adjustedSlideIndex = this.preview
      ? this.slideIndex - 1
      : this.slideIndex;

    // Make sure we have a valid mapping.
    if (adjustedSlideIndex >= 0 && adjustedSlideIndex < visibleIndices.length) {
      const actualQuestionIndex = visibleIndices[adjustedSlideIndex];
      let question = this.questions[actualQuestionIndex];

      if (question.optional) {
        this.showContinueButton();
      } else {
        this.hideContinueButton();
      }
    }

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
    const adjustedSlideIndex = this.preview
      ? this.slideIndex - 1
      : this.slideIndex;

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
    this.swiper.swiperRef.slideTo(this.preview ? index + 1 : index, speed);
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
    let question =
      this.questions[this.preview ? this.slideIndex - 1 : this.slideIndex];
    // Get the visible questions mapping.
    const visibleIndices = this.visibleQuestionIndices;

    // Adjust the index if you're using a preview slide.
    const adjustedSlideIndex = this.preview
      ? this.slideIndex - 1
      : this.slideIndex;

    // Make sure we have a valid mapping.
    if (adjustedSlideIndex >= 0 && adjustedSlideIndex < visibleIndices.length) {
      const actualQuestionIndex = visibleIndices[adjustedSlideIndex];
      question = this.questions[actualQuestionIndex];
    }
    if (this.preview && this.slideIndex == 0) return true;
    else if (CONSTANT_TYPES.includes(question.type)) {
      if (question.value !== '' && question.value !== null) {
        return this.isConstantInputValid;
      } else return false;
    } else if (
      question.optional ||
      (question.value != null && question.value != '')
    )
      return true;
    else if (question.type == 'csi_multiple')
      return this.multValue(question.id);
    return false;
  }

  inputChange(
  index: number,
  e: any = null,
  slide: boolean = true,
  valNul: boolean = false
) {
  const question = this.questions[index];
  if (question.type === 'pain_location_pati') {
    if (!Array.isArray(question.value)) {
      question.value = [];
    }
  
    if (valNul) {
      question.value = [];
    } else if (question.value.includes(e)) {
      question.value = question.value.filter(v => v !== e);
    } else {
      question.value = [...question.value, e];
    }
  } else {
    if (e != null && !valNul) {
      question.value = e;
    } else if (valNul) {
      question.value = null;
      this.hideContinueButton();
    }
  }

  this.saveAnswers();
  console.log(question.value);

  if (slide) {
    setTimeout(() => {
      this.slideNext();
    }, TIMEOUT_TIME);
  } else {
    if (question.type == 'mult') {
      if (this.multValue(question.main_tag)) {
        this.showContinueButton();
      }
    } else if (!valNul) {
      this.showContinueButton();
    }
  }

  this.isCompleted = !this.formHasErrors();
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
      behavior: 'smooth', // Enable smooth scrolling
    });
  }

  checkScroll(index: number) {
    const element = this.scrollContainers.get(index)?.nativeElement;
    if (element) {
      const isScrolledToBottom =
        element.scrollTop + element.clientHeight >= element.scrollHeight - 1;
      if (isScrolledToBottom)
        this.hasScroll.splice(this.hasScroll.indexOf(index), 1);
    }
  }

  getNativeElem(index: number) {
    return this.scrollContainers.get(index)?.nativeElement;
  }

  divideOption(option: any, index: 0 | 1) {
    if (option) return option.split(':')[index];
    return null;
  }

  showContinueButton() {
    this.continueButton = true;
  }
  hideContinueButton() {
    this.continueButton = false;
  }

  checkHasLang(lang: Lang, toCheck: Array<string> = ['ca', 'es', 'en']) {
    // Use info.subtitle if the question is of type 'info', otherwise use label.
    let label =
      this.questions[0].type === 'info'
        ? this.questions[0].info?.subtitle?.[lang] ?? ''
        : this.questions[0].label[lang];

    if (label && label.trim() !== '') {
      this.selectedLang = lang;
      return; // Exit the function if a valid language is found.
    }

    // If not, remove the current lang from fallback options.
    toCheck.splice(toCheck.indexOf(lang), 1);
    if (toCheck.length === 0) {
      this.sendSurvey.emit({
        questions: null,
        role: 'error',
      });
      return;
    }
    // Try the next language in the fallback array.
    this.checkHasLang(toCheck[0] as Lang, toCheck);
  }

  async saveAnswers() {
    if (!this.useLocalStorage) return;

    let answers = await this.questions
      .filter(function (obj) {
        return obj.value != null && obj.value != '';
      })
      .map((elem) => ({
        ID: elem?.id,
        VALOR: elem?.value,
      }));

    let possibleAnswers = await this.questions.filter((q) => {
      if (q.type === 'info') return false;
      return this.shouldRenderQuestion(q);
    });

    let progress = Math.round((answers.length * 100) / possibleAnswers.length);

    Preferences.set({
      key: this.answersId,
      value: JSON.stringify({
        answers: answers,
        progress: progress,
      }),
    });
  }

  async checkSavedAnswers() {
    if (!this.useLocalStorage) return;
    if (!this.answersId) return;
    let preference = (await Preferences.get({ key: this.answersId })).value;
    if (!preference) return;
    let answers = JSON.parse(preference);

    if (answers)
      await answers.answers.forEach((answer: any) => {
        const index = this.questions.findIndex((question) => {
          return question.id == answer.ID;
        });
        if (index >= 0) {
          this.questions[index].value = answer.VALOR;
          this.lastIndex = index;
        }
      });
  }

  slideLastAnswered() {
    this.slideTo(this.lastIndex ?? 0 + 1, 500);
    this.lastIndex = null;
  }

  ngAfterViewInit() {
    this.disableTabNavigation();
  }

  disableTabNavigation() {
    document.addEventListener('keydown', this.handleTabKeydown);
  }

  handleTabKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleTabKeydown);
  }
}

type Type =
  | 'number'
  | 'select'
  | 'text'
  | 'pain'
  | 'pain_pati'
  | 'csi_multiple'
  | 'mult'
  | 'info'
  | 'select_mood'
  | 'input_num'
  | 'input_text'
  | 'pain_location'
  | 'pain_location_pati'
  | 'blood_glucose'
  | 'blood_pressure'
  | 'heart_rate'
  | 'scale'
  | 'thermometer';
type Lang = 'ca' | 'es' | 'en';
export type Question =
  | {
      id: string;
      tag: string | null;
      order: number | string;
      label: Multilang;
      value: string[];
      type: 'pain_location_pati';
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
      group_name: string | null;
    }
  | {
      id: string;
      tag: string | null;
      order: number | string;
      label: Multilang;
      value: string | number | BloodPreasure | null;
      type: Exclude<Type, 'pain_location_pati'>;
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
      group_name: string | null;
    };


export interface BloodPreasure {
  sys_value: string;
  dia_value: string;
  bpm_value: string;
}

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
  ordinary_name: Multilang;
  formal_name: Multilang;
}
