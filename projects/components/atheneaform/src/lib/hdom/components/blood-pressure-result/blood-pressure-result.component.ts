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
  selector: 'app-blood-pressure-result',
  templateUrl: './blood-pressure-result.component.html',
  styleUrls: [
    '../../styles/hdom.page.scss',
    '../../styles/scan.component.scss',
    './blood-pressure-result.component.scss',
  ],
})
export class BloodPressureResultComponent implements OnInit, OnChanges {
    ngOnInit(): void {
    this.temp_sys_value = this.value.sys_value;
    this.temp_dia_value = this.value.dia_value;

    queueMicrotask(() => {
      this.checkValid();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      const newValue = changes['value'].currentValue;
      this.temp_sys_value = newValue.sys_value || this.temp_sys_value;
      this.temp_dia_value = newValue.dia_value || this.temp_dia_value;
    }
  }

  @Output() inputValid = new EventEmitter<{
    BloodPreasure: BloodPreasure;
    valid: boolean;
  }>(); // Language
  @Input() selectedLang: Lang = 'ca';
  @Input() canAnswer: boolean = true;

  // Value que tindra la questio
  @Input() value: BloodPreasure = {
    sys_value: '',
    dia_value: '',
  };
  // Value que sortira en el display en cas que possi un valor erroni per aixi no trencar
  temp_sys_value: string = '';
  temp_dia_value: string = '';

  checkSystolic: any = {};
  checkDiastolic: any = {};
  checkBpms: any = {};

  constructor(
    public validator: InputValidationService,
    public hdom: HdomService
  ) {}

  checkValid() {
    if (
      (this.temp_sys_value !== null && this.temp_sys_value !== '') ||
      (this.temp_dia_value !== null && this.temp_dia_value !== '')
    ) {
      let res = this.validator.isBloodPressure(
        this.temp_sys_value,
        this.temp_dia_value
      );
      this.checkSystolic = res.checkSystolic;
      this.checkDiastolic = res.checkDiastolic;
    }

    const updatedValue: BloodPreasure = {
      sys_value: this.temp_sys_value,
      dia_value: this.temp_dia_value,
    };

    const valid =
      this.checkSystolic.valid &&
      this.checkDiastolic.valid;

    this.inputValid.emit({ BloodPreasure: updatedValue, valid: valid });
  }
}

type Lang = 'ca' | 'es' | 'en';

export interface BloodPreasure {
  sys_value: string;
  dia_value: string;
}
