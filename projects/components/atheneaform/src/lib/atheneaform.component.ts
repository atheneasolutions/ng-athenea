import { IonicModule, ModalController, RangeCustomEvent } from '@ionic/angular';
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent, SwiperModule } from 'swiper/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
const TIMEOUT_TIME = 350;
const SI_VAL = '1';

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
  @Input() lang: 'ca' | 'es' | 'en' = 'ca';
  @Output() sendSurvey:EventEmitter<any> = new EventEmitter<any>();
  //PREVIEW
  @Input() preview: Preview | null = null;
  @Input() canAnswer: boolean = true;

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
    spaceBetween: 30, // Add space between slides
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
  multMap: any[] = [];

  slideIndex: number = 0;
  isCompleted: Boolean = false;

  constructor(
    // private modalCtrl: ModalController
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.questions.forEach((question, index) => {
      if (question.type == 'csi_multiple') this.multMap[question.id] = [];
      else if (question.type == 'mult') {
        this.multMap[question.main_tag].push(index);

        // let cont = true;

        // while (cont) {
        //   const childQuestion = this.questions[index];
        //   if (childQuestion.main_tag == question.id) {
        //     questions.push(index);
        //     index++;
        //     // this.questions.splice(index, 1);
        //   } else cont = false;
        // }
        // this.isMult[parentIndex] = questions;
      }
    });
  }

  ngAfterViewChecked(): void {
    this.scrollContainers.forEach((scrollContainer: ElementRef, index: number) => {
      const element = scrollContainer.nativeElement;
      
      const isScrollable = element.scrollHeight > element.clientHeight;
      this.hasScroll[index] = isScrollable;
    });
  }

  saveSurvey() {
    if (!this.canAnswer) return;
    if (this.formHasErrors(true)) return;

    this.sendSurvey.emit({
      "questions": this.questions,
      "role": 'send'
    });
  }

  formHasErrors(slide = false): Boolean {
    for (let index = 0; index < this.questions.length; index++) {
      const elem = this.questions[index];
      if (elem.value == null) {
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
      case 'csi_multiple':
        return this.multiple;
      default:
        return this.txtSelector;
    }
  }

  isMainPositive(mainTag: string | null) {
    if (mainTag) {
      let question = this.getQuestion(mainTag);
      //NO és ópitm
      if (question && question.type == 'csi_multiple') return true;
      if (question && question.value == SI_VAL) return true;
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
    this.swiper.swiperRef.slideTo(this.preview ? index+1 : index, speed);
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
    if (!this.canAnswer) return true;
    //Si pregunta contestada pot continuar, sinó no
    if (this.preview && this.slideIndex == 0) return true;
    else if (this.questions[this.preview ? this.slideIndex-1 : this.slideIndex].value != null) return true;
    return false;
  }

  inputChange(index: number, e: any = null, slide: boolean = true) {
    //Assignem valor
    if (e) this.questions[index].value = e;

    if (slide)
    setTimeout(() => {
      this.slideNext();
    }, TIMEOUT_TIME);

    if (!this.formHasErrors()) this.isCompleted = true;
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
    elem.classList.add('d-none');
  }

  getNativeElem(index: number) {
    return (this.scrollContainers.get(index))?.nativeElement;
  }

  divideOption(option: any, index: 0 | 1) {
    if (option) return (option.split(':'))[index];
    return null;
  }
}

type Type = 'number' | 'select' | 'text' | 'pain' | 'csi_multiple' | 'mult';
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