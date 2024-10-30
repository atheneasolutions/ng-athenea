import { IonicModule, ModalController, RangeCustomEvent } from '@ionic/angular';
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent, SwiperModule } from 'swiper/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
const TIMEOUT_TIME = 350;
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

  slideIndex: number = 0;
  isCompleted: Boolean = false;

  selectedLabel: string | null = null;
  painScaleLabels = [
    {
      value: 5,
      label: {
        ca: "Sense dolor",
        es: "Sin dolor",
        en: "Without pain"
      }
    },
    {
      value: 4,
      label: {
        ca: "Dolor molt lleu",
        es: "Dolor muy leve",
        en: "Very mild pain"
      }
    },
    {
      value: 3,
      label: {
        ca: "Dolor lleu",
        es: "Dolor leve",
        en: "Mild pain"
      }
    },
    {
      value: 2,
      label: {
        ca: "Dolor moderat",
        es: "Dolor moderado",
        en: "Moderate pain"
      }
    },
    {
      value: 1,
      label: {
        ca: "Dolor sever",
        es: "Dolor severo",
        en: "Severe pain"
      }
    },
    {
      value: 0,
      label: {
        ca: "Dolor insoportable",
        es: "Dolor insoportable",
        en: "Unbearable pain"
      }
    }
  ]

  constructor(
    // private modalCtrl: ModalController
    private cdr: ChangeDetectorRef
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
    if (!this.canAnswer) return;
    if (this.formHasErrors(true)) return;

    this.sendSurvey.emit({
      "questions": this.questions,
      "role": 'send'
    });
  }

  formHasErrors(slide = false): Boolean {
    //Itera entre les preguntes
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
      default:
        return this.txtSelector;
    }
  }

  isMainPositive(mainTag: string | null) {
    if (mainTag) {
      let question = this.getQuestion(mainTag);
      if (question && question.value == '1') return true;
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
    else if (this.questions[this.preview ? this.slideIndex-1 : this.slideIndex].value) return true;
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

  // close() {
  //   this.modalCtrl.dismiss();
  // }

  descend(a: any, b: any) {
    return b.key - a.key;
  }

  divideOption(option: any, index: 0 | 1) {
    if (option) return (option.split(':'))[index];
    return null;
  }

  updateLabel(index: number, e: Event) {
    let question = this.questions[index].value;
    switch ((e as RangeCustomEvent).detail.value) {
      case 0:
        this.selectedLabel = this.painScaleLabels[0].label[this.lang];
        question = this.painScaleLabels[0].value;
        break;
      case 1:
      case 2:
        this.selectedLabel = this.painScaleLabels[1].label[this.lang];
        question = this.painScaleLabels[1].value;
        break;
        break;
      case 3:
      case 4:
        this.selectedLabel = this.painScaleLabels[2].label[this.lang];
        question = this.painScaleLabels[2].value;
        break;
      case 5:
      case 6:
        this.selectedLabel = this.painScaleLabels[3].label[this.lang];
        question = this.painScaleLabels[3].value;
        break;
      case 7:
      case 8:
        this.selectedLabel = this.painScaleLabels[4].label[this.lang];
        question = this.painScaleLabels[4].value;
        break;
      case 9:
      case 10:
      default:
        this.selectedLabel = this.painScaleLabels[5].label[this.lang];
        question = this.painScaleLabels[5].value;
        break;
    }
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