import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { HdomService } from '../../services/hdom.service';
import { InputValidationService } from '../../services/input-validation.service';

@Component({
  selector: 'app-heart-rate-result',
  templateUrl: './heart-rate-result.component.html',
  styleUrls: [
    '../../styles/hdom.page.scss',
    '../../styles/scan.component.scss',
    './heart-rate-result.component.scss',
  ],
})
export class HeartRateResultComponent implements OnInit, OnChanges {
    ngOnInit(): void {
    this.temp_value = this.value;

    queueMicrotask(() => {
      this.checkValid();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.temp_value = changes['value'].currentValue;

      queueMicrotask(() => {
        this.checkValid();
      });
    }
  }

  @Output() inputValid = new EventEmitter<string>(); // Language
  @Input() selectedLang: Lang = 'ca';
  @Input() canAnswer: boolean = true;
  // Value que tindra la questio
  @Input() value: string = '';
  // Value que sortira en el display en cas que possi un valor erroni per aixi no trencar
  temp_value: string = this.value;

  check: any = {};

  constructor(
    public validator: InputValidationService,
    public hdom: HdomService
  ) {}

  checkValid() {
    this.check = this.validator.isHeartRate(this.temp_value);
    if (this.check.valid) {
      this.value = this.temp_value;
      this.inputValid.emit(this.value);
    } else {
      this.inputValid.emit('');
    }
  }
}

type Lang = 'ca' | 'es' | 'en';
