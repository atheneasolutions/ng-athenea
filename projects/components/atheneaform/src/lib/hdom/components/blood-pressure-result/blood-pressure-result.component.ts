import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HdomService } from '../../services/hdom.service';
import { InputValidationService } from '../../services/input-validation.service';


@Component({
  selector: 'app-blood-pressure-result',
  templateUrl: './blood-pressure-result.component.html',
  styleUrls: ['../../styles/hdom.page.scss',  '../../styles/scan.component.scss', './blood-pressure-result.component.scss'],
})

export class BloodPressureResultComponent implements OnInit {

  ngOnInit(): void {
    this.temp_value = this.value
    this.checkValid('systolic')
    this.checkValid('diastolic')
  }

  @Output() inputValid = new EventEmitter<BloodPreasure>();  // Language
  @Input() selectedLang: Lang = 'ca';

  // Value que tindra la questio
  @Input() value: BloodPreasure = {
    sys_value: '',
    dia_value: '',
    bpm_value: '',
  };
  // Value que sortira en el display en cas que possi un valor erroni per aixi no trencar
  temp_value: BloodPreasure =  {
    sys_value: '',
    dia_value: '',
    bpm_value: ''
  };

  
  checkSystolic: any = {};
  checkDiastolic: any = {};

  constructor(public validator: InputValidationService,
    public hdom: HdomService) { }

  checkValid(type: any) {
    if (type === 'systolic') {
      this.checkSystolic = this.validator.isBloodPressure(this.temp_value.sys_value);
    }  else {
      this.checkDiastolic = this.validator.isBloodPressure(this.temp_value.dia_value);
    }

    if (this.checkSystolic.valid && this.checkDiastolic.valid) {
      this.value.dia_value = this.temp_value.dia_value
      this.value.sys_value = this.temp_value.sys_value
      this.inputValid.emit(this.value);
    } else {
      this.inputValid.emit({
        sys_value: '',
        dia_value: '',
        bpm_value: ''
      });
    }
  }
}

type Lang = 'ca' | 'es' | 'en';

export interface BloodPreasure {
  sys_value: string;
  dia_value: string;
  bpm_value: string;
} 