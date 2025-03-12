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
    this.temp_bpm_value = this.value.bpm_value;
    this.temp_dia_value = this.value.dia_value;
    this.checkValid();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.value = changes['value'].currentValue;
    }
  }

  @Output() inputValid = new EventEmitter<BloodPreasure>(); // Language
  @Input() selectedLang: Lang = 'ca';

  // Value que tindra la questio
  @Input() value: BloodPreasure = {
    sys_value: '',
    dia_value: '',
    bpm_value: '',
  };
  // Value que sortira en el display en cas que possi un valor erroni per aixi no trencar
  temp_sys_value: string = '';
  temp_dia_value: string = '';
  temp_bpm_value: string = '';

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

    if (this.temp_bpm_value !== null && this.temp_bpm_value !== '') {
      this.checkBpms = this.validator.isHeartRate(this.temp_bpm_value);
    }

    this.value = {
      sys_value: this.temp_sys_value,
      dia_value: this.temp_dia_value,
      bpm_value: this.temp_bpm_value,
    };

    this.inputValid.emit(this.value);
  }
}

type Lang = 'ca' | 'es' | 'en';

export interface BloodPreasure {
  sys_value: string;
  dia_value: string;
  bpm_value: string;
}
