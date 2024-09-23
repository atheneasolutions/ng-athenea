import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent, SwiperModule } from 'swiper/angular';

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
  @Output() sendSurvey = new EventEmitter<Question[]>();
  @Input() lang: 'ca' | 'es' | 'en' = 'ca';

  @ViewChild('frequencySelector') frequencySelector!: TemplateRef<any>;
  @ViewChild('numberSelector') numberSelector!: TemplateRef<any>;
  @ViewChild('txtSelector') txtSelector!: TemplateRef<any>;
  @ViewChild('yesnoSelector') yesnoSelector!: TemplateRef<any>;
  
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
    keyboard: { enabled: true } // Enable keyboard navigation
  }

  loading:boolean = false;
  errors: number[] = [];
  hasScroll: any[] = [];

  constructor(
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

    //Si hi ha errors, slideTo el primer
    if (this.errors.length > 0) 
    {
      this.slideTo(this.errors[0]);
      return;
    }

    this.sendSurvey.emit(this.questions);
  }

  getType(type: string) {
    switch (type) {
      case 'number':
        return this.numberSelector;   
      case 'frequency':
        return this.frequencySelector;   
      case 'yesno':
        return this.yesnoSelector;
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
      return obj.tag === tag;
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

  onSlideChange() {
  }

  get isBegining() {
    return this.swiper?.swiperRef.isBeginning;
  }

  get isEnd() {
    return this.swiper?.swiperRef.isEnd;
  }

  inputChange(index: number, e: any = null) {
    //Assignem valor
    if (e) this.questions[index].value = e;
    //Si hi ha errors, slideTo el següent

    let indexof = this.errors.indexOf(index);
    if (indexof > -1) this.errors.splice(indexof, 1);
    if (this.errors.length > 0) {
      setTimeout(() => {
        this.slideTo(this.errors[0], 250);
      }, 150);
    }
    //Si no hi ha errors, slideNext
    else 
      setTimeout(() => {
        this.slideNext();
      }, 150);

  }

}

type Type = 'number' | 'frequency' | 'text' | 'conditional';
export interface Question {
  tag: string;
  label: {
    ca: string,
    es: string,
    en: string
  };
  value: string | number | null;
  type: Type;
  mainTag: string | null;
};