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
    this.checkValid('systolic')
    this.checkValid('diastolic')
  }

  @Input() inputChange!: (sys_value: string, dia_value: string) => void;

  // Value que tindra la questio
  @Input() sys_value: string = '';
  // Value que sortira en el display en cas que possi un valor erroni per aixi no trencar
  temp_sys_value: string = '';

  // Value que tindra la questio
  @Input() dia_value: string = '';
  // Value que sortira en el display en cas que possi un valor erroni per aixi no trencar
  temp_dia_value: string = '';
  
  checkSystolic: any = {};
  checkDiastolic: any = {};

  constructor(public validator: InputValidationService,
    public hdom: HdomService) { }

  checkValid(type: any) {
    if (type === 'systolic') this.checkSystolic = this.validator.isBloodPressure(this.temp_sys_value);
    else this.checkDiastolic = this.validator.isBloodPressure(this.temp_dia_value);
    if (this.checkSystolic.valid && this.checkDiastolic.valid) this.inputChange(this.sys_value, this.dia_value)
  }
}