import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HdomService } from '../../services/hdom.service';
import { InputValidationService } from '../../services/input-validation.service';

@Component({
  selector: 'app-blood-glucose-result',
  templateUrl: './blood-glucose-result.component.html',
  styleUrls: ['../../styles/hdom.page.scss', '../../styles/scan.component.scss', './blood-glucose-result.component.scss'],
})
export class BloodGlucoseResultComponent implements OnInit, OnChanges {

  ngOnInit(): void {
    this.temp_value = this.value
    this.checkValid()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.temp_value = changes.value.currentValue;
      this.checkValid();
    }
  }
  
  @Output() inputValid = new EventEmitter<string>();  // Language

  @Input() selectedLang: Lang = 'ca';
  // Value que tindra la questio
  @Input() value: string = '';
  // Value que sortira en el display en cas que possi un valor erroni per aixi no trencar
  temp_value: string = '';
  
  check: any = {};


  constructor(public validator: InputValidationServiceTemp,
    public hdom: HdomServiceTemp) { }

  checkValid() {
    this.check = this.validator.isBloodGlucose(this.temp_value);
    if (this.check.valid) {
      this.value = this.temp_value
      this.inputValid.emit(this.value);
    } else {
      this.inputValid.emit('');
    }
  }
}

type Lang = 'ca' | 'es' | 'en';