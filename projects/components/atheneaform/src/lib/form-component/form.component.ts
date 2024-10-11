import { IonicModule, ModalController } from '@ionic/angular';
import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent, SwiperModule } from 'swiper/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
const TIMEOUT_TIME = 150;
@Component({
  selector: 'atheneaform',
  standalone: true,
  imports: [
    CommonModule,
    SwiperModule,
    IonicModule,
    FormsModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements AfterViewChecked {

  @Input() questions: Question[] = [];
  @Input() title: string | null = null;
  @Input() lang: 'ca' | 'es' | 'en' = 'ca';

  @ViewChild('numberSelector') numberSelector!: TemplateRef<any>;
  @ViewChild('txtSelector') txtSelector!: TemplateRef<any>;
  // @ViewChild('frequencySelector') frequencySelector!: TemplateRef<any>;
  // @ViewChild('yesnoSelector') yesnoSelector!: TemplateRef<any>;
  // @ViewChild('assuranceSelector') assuranceSelector!: TemplateRef<any>;
  // @ViewChild('treatmentSelector') treatmentSelector!: TemplateRef<any>;
  // @ViewChild('experienceSelector') experienceSelector!: TemplateRef<any>;
  @ViewChild('select') select!: TemplateRef<any>;
  
  @ViewChild('swiper') swiper!: SwiperComponent;
  @ViewChildren('scrollContainer') scrollContainers!: QueryList<ElementRef>;

  config: SwiperOptions = {
    direction: 'vertical',
    slidesPerView: 1, // Show only one slide at a time
    spaceBetween: 30, // Add space between slides
    allowTouchMove: false, // Allow manual swipe between slides
    pagination: {
      // el: 'form-progressbar',
      enabled: true,
      type: 'progressbar',
      progressbarOpposite: true
    },
    effect: 'slide', // You can use 'fade' for a fade effect
    speed: 600, // Smooth transition speed
    preventInteractionOnTransition: true, // Prevent interaction while sliding
  }

  loading:boolean = false;
  errors: number[] = [];
  hasScroll: any[] = [];

  slideIndex: number = 0;
  isCompleted: Boolean = false;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    this.scrollContainers.forEach((scrollContainer: ElementRef, index: number) => {
      const element = scrollContainer.nativeElement;
      
      const isScrollable = element.scrollHeight > element.clientHeight;
      this.hasScroll[index] = isScrollable;
    });
  }

  saveSurvey() {
    this.checkForFormErrors();
    //Si hi ha errors, slideTo el primer
    if (this.errors.length > 0) 
    {
      this.slideTo(this.errors[0]);
      return;
    }

    this.modalCtrl.dismiss(this.questions, 'send');
  }

  checkForFormErrors() {
    //Restart errors
    this.errors = [];

    //Itera entre les preguntes
    this.questions.forEach((elem, index) => {
      //Comprova preguntes sense resposta
      if (!elem.value) {
        if (elem?.mainTag) {
          if (this.isMainPositive(elem.mainTag))
            this.errors.push(index);
        }
        else 
          this.errors.push(index);
      }
    });
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  getType(type: string) {
    switch (type) {
      case 'number':
        return this.numberSelector;   
      case 'select':
        return this.select;   
      // case 'frequency':
      //   return this.frequencySelector;   
      // case 'yesno':
      //   return this.yesnoSelector;
      // case 'assurance':
      //   return this.assuranceSelector;
      // case 'treatment':
      //   return this.treatmentSelector;
      // case 'experience':
      //   return this.experienceSelector;
      default:
        return this.txtSelector;
    }
  }

  isMainPositive(mainTag: string | null) {
    if (mainTag) {
      let question = this.getQuestion(mainTag);
      if (question && question.value == 'si') return true;
    }
    
    return false;
  }

  getQuestion(tag: string) {
    return this.questions.find(obj => {
      return obj.id === tag;
    });
  }

  slideNext() {
    this.swiper.swiperRef.slideNext(250);
  }

  slidePrevious() {
    this.swiper.swiperRef.slidePrev(250);
  }

  slideTo(index: number, speed: number = 100) {
    this.swiper.swiperRef.slideTo(index, speed);
  }

  onSlideChange(e: any) {
    this.slideIndex = e[0]?.activeIndex;
  }

  get isBegining() {
    return this.swiper?.swiperRef.isBeginning;
  }

  get canContinue() {
    //Si final swiper no continua
    if (this.swiper?.swiperRef.isEnd) return false;

    //Si pregunta contestada pot continuar, sinó no
    if (this.questions[this.slideIndex].value) return true;
    return false;
  }

  // get isEnd() {
  //   return this.swiper?.swiperRef.isEnd;
  // }

  //TODO rethink errors, ara no es pot continuar si no està contestat
  inputChange(index: number, e: any = null) {
    //Assignem valor
    if (e) this.questions[index].value = e;
    //Si hi ha errors, slideTo el següent

    let indexof = this.errors.indexOf(index);
    if (indexof > -1) this.errors.splice(indexof, 1);
    if (this.errors.length > 0) {
      setTimeout(() => {
        this.slideTo(this.errors[0], 250);
      }, TIMEOUT_TIME);
    }
    //Si no hi ha errors, slideNext
    else 
      setTimeout(() => {
        this.slideNext();
      }, TIMEOUT_TIME);

    this.checkForFormErrors();
    if (this.errors.length == 0) this.isCompleted = true;
    else this.isCompleted = false;

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
    const elem = this.getNativeElem(index);
    const threshold = 1;
    let isBottom =  ((elem.scrollTop + elem.clientHeight) < (elem.scrollHeight - threshold));
    if (isBottom) elem.classList.add('d-none');
  }

  getNativeElem(index: number) {
    return (this.scrollContainers.get(index))?.nativeElement;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  noSort(a: any, b: any) {
    return 0;
  }

  divideOption(option: any, index: 0 | 1) {
    if (option) return (option.split(':'))[index];
    return null;
  }
}

type Type = 'number' | 'frequency' | 'text' | 'conditional';
export interface Question {
  id: string;
  tag: string | null;
  order: number | string;
  label: Multilang;
  value: string | number | null;
  type: Type;
  options: Record<string, Multilang> | null | string;
  mainTag: string | null;
};

export interface Multilang {
  ca: string;
  es: string;
  en: string;
}