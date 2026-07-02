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
  'unit',
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
  styleUrls:[ './form-component/form.component.scss'],
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

  @ViewChild('numberSelector') numberSelector!: TemplateRef<any>;
  @ViewChild('txtSelector') txtSelector!: TemplateRef<any>;
  @ViewChild('select') select!: TemplateRef<any>;
  @ViewChild('painSelector') pain!: TemplateRef<any>;
  @ViewChild('diagnosisMultiple') multiple!: TemplateRef<any>;
  @ViewChild('info') info!: TemplateRef<any>;
  @ViewChild('selectMood') selectMood!: TemplateRef<any>;
  @ViewChild('inputNum') inputNum!: TemplateRef<any>;
  @ViewChild('painLocation') painLocation!: TemplateRef<any>;

  @ViewChild('bloodGlucose') bloodGlucose!: TemplateRef<any>;
  @ViewChild('bloodPressure') bloodPressure!: TemplateRef<any>;
  @ViewChild('heartRate') heartRate!: TemplateRef<any>;
  @ViewChild('scale') scale!: TemplateRef<any>;
  @ViewChild('thermometer') thermometer!: TemplateRef<any>;
  @ViewChild('heart') heart!: TemplateRef<any>;
  @ViewChild('unit') unit!: TemplateRef<any>;

  @ViewChild('swiper') swiper!: SwiperComponent;
  @ViewChildren('scrollContainer') scrollContainers!: QueryList<ElementRef>;

  moods = [
    {
      value: 'happy',
      icon: './../../../../assets/icons/face-happy-svgrepo-com.svg',
      label: { en: 'Happy', es: 'Feliz', ca: 'Feliç' },
      index: 0,
    },
    {
      value: 'neutral',
      icon: './../../../../assets/icons/face-neutral-svgrepo-com.svg',
      label: { en: 'Neutral', es: 'Neutral', ca: 'Neutral' },
      index: 1,
    },
    {
      value: 'sad',
      icon: './../../../../assets/icons/face-sad-svgrepo-com.svg',
      label: { en: 'Sad', es: 'Triste', ca: 'Trist' },
      index: 2,
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

  constantInputValidity: Record<number, boolean> = {};

  onConstantInputValidChange(
    index: number,
    { value, valid }: { value: string; valid: boolean }
  ) {
    this.constantInputValidity[index] = valid;

    if (!valid) {
      this.hideContinueButton();
      return;
    }

    this.inputChange(index, value, false);
    this.showContinueButton();
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
    this.constantInputValidity[index] = valid;

    if (!valid) {
      this.hideContinueButton();
      return;
    }

    this.inputChange(index, BloodPreasure, false);
    this.showContinueButton();
  }

  onZoneClick(index: number, zone_code: string, slide: boolean): void {
    this.selectedZone = zone_code;
    this.inputChange(index, zone_code, slide);
  }

  questionValueIsZero(id: string | null): boolean {
    if (id == null) return true;
    let question = this.questions.find((q) => q.id === id);
    return question?.value == 0;
  }

  shouldRenderQuestion(question: Question): boolean {
    // Si hi ha logica de int_comparator
    if (question?.int_comparator_question != null && question?.int_comparator_condition != null && question?.int_comparator_value != null){
      return this.operateIntConditional(question.int_comparator_question, question.int_comparator_condition, question.int_comparator_value);
    }
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
    const value = this.questions[index].value;

    if (typeof value === 'object' && value !== null) {
      return {
        dia_value: value.dia_value ?? '',
        sys_value: value.sys_value ?? '',
        bpm_value: value.bpm_value ?? '',
      };
    }

    return { dia_value: '', sys_value: '', bpm_value: '' };
  }

  getString(value: string | number | BloodPreasure | null): string {
    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number') {
      return '' + value + '';
    }

    return '';
  }

  getUnitType(type_unit: string | null | undefined): string {
    if (typeof type_unit === 'string') {
      return type_unit;
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
      if (!this.shouldRenderQuestion(elem)) continue;
      if (elem.optional) continue;
      if (elem.value == null && elem.type != SKIP_CHECK_TYPE) {
        if (elem?.main_tag) {
          if (this.isMainPositive(elem.main_tag)) {
            if (slide) this.slideToQuestionIndex(index);
            return true;
          }
        } else {
          if (slide) this.slideToQuestionIndex(index);
          return true;
        }
      }

      if (
        CONSTANT_TYPES.includes(elem.type) &&
        this.constantInputValidity[index] === false
      ) {
        if (slide) this.slideToQuestionIndex(index);
        return true;
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
      case 'info':
        return this.info;
      case 'select_mood':
        return this.selectMood;
      case 'input_num':
        return this.inputNum;
      case 'pain_location':
        return this.painLocation;
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
      case 'unit':
        return this.unit;
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

  operateIntConditional(int_comparator_question: string, int_comparator_condition:IntComparatorConditionals, int_comparator_value:number){
    const question = this.getQuestion(int_comparator_question);
    const rawValue = question?.value;

    const value =
      typeof rawValue === 'number'
        ? rawValue
        : Number(String(rawValue).replace(',', '.'));

    if (!Number.isFinite(value)) return false;

    if (int_comparator_condition === "greater_than" && value > int_comparator_value) return true;
    if (int_comparator_condition === "less_than" && value < int_comparator_value) return true;
    if (int_comparator_condition === "equal" && value === int_comparator_value) return true;

    return false;
  }

  getDisplayTag(question: Question): string {
    const visibleQuestions = this.questions.filter(q =>
      this.shouldRenderQuestion(q) && q.type !== 'info'
    );
    const index = visibleQuestions.findIndex(q => q.id === question.id);

    return index >= 0 ? `${index + 1}.` : '';
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

  slideToQuestionIndex(questionIndex: number, speed: number = 100) {
    const visibleSlideIndex = this.visibleQuestionIndices.indexOf(questionIndex);

    if (visibleSlideIndex === -1) return;

    this.swiper.swiperRef.slideTo(
      this.preview ? visibleSlideIndex + 1 : visibleSlideIndex,
      speed
    );
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
    if (this.preview && this.slideIndex == 0) return true;

    const current = this.getCurrentVisibleQuestion();

    if (!current) return false;

    const { index, question } = current;

    if (question.type == 'csi_multiple')
      return this.multValue(question.id);

    if (CONSTANT_TYPES.includes(question.type)) {
      if (question.optional && (question.value == null || question.value === '')) {
        return true;
      }

      return (
        question.value !== null &&
        question.value !== '' &&
        this.constantInputValidity[index] === true
      );
    }

    if (
      question.optional ||
      (question.value != null && question.value != '')
    ) {
      return true;
    }

    return false;
  }

  private getCurrentVisibleQuestion():
    | { index: number; question: Question }
    | null {
    const visibleIndices = this.visibleQuestionIndices;
    const adjustedSlideIndex = this.preview
      ? this.slideIndex - 1
      : this.slideIndex;

    if (
      adjustedSlideIndex < 0 ||
      adjustedSlideIndex >= visibleIndices.length
    ) {
      return null;
    }

    const questionIndex = visibleIndices[adjustedSlideIndex];

    return {
      index: questionIndex,
      question: this.questions[questionIndex],
    };
  }

  inputChange(
    index: number,
    e: any = null,
    slide: boolean = true,
    valNul: boolean = false
  ) {
    //Assignem valor
    if (e !== null && e !== undefined && !valNul) this.questions[index].value = e;
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
        if (this.multValue(this.questions[index].main_tag))
          this.showContinueButton();
      } else if (!valNul) this.showContinueButton();
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
  | 'csi_multiple'
  | 'mult'
  | 'info'
  | 'select_mood'
  | 'input_num'
  | 'pain_location'
  | 'blood_glucose'
  | 'blood_pressure'
  | 'heart_rate'
  | 'scale'
  | 'thermometer'
  | 'unit';

type IntComparatorConditionals =
  | 'greater_than'
  | 'less_than'
  | 'equal';

type Lang = 'ca' | 'es' | 'en';
export interface Question {
  id?: string;
  tag?: string | null;
  order?: number | string;
  label: Multilang;
  value: string | number | BloodPreasure | null;
  type: Type;
  options?: Record<string, Multilang> | null | string | Array<any>;
  main_tag: string | null;
  escala?: string | null;
  caract_form?: string | null;
  optional?: boolean;
  info?: Info | null;
  units?: string | null;
  max_questions?: number | null;
  min_questions?: number | null;
  headform?: string | null;
  depends_on: string | null;
  group_name?: string | null;
  int_comparator_question?: string | null;
  int_comparator_condition?: IntComparatorConditionals |null;
  int_comparator_value?: number | null;
  type_unit?: string| null;
}

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
