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
  selector: 'app-thermometer-result',
  templateUrl: './thermometer-result.component.html',
  styleUrls: [
    '../../styles/hdom.page.scss',
    '../../styles/scan.component.scss',
    './thermometer-result.component.scss',
  ],
})
export class ThermometerResultComponent implements OnInit, OnChanges {
  ngOnInit(): void {
    this.temp_value = this.value;
    this.checkValid();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.temp_value = changes['value'].currentValue || this.temp_value;
      this.checkValid();
    }
  }

  @Output() inputValid = new EventEmitter<{
    value: string;
    valid: boolean;
  }>();
  // Language
  @Input() selectedLang: Lang = 'ca';
  @Input() canAnswer: boolean = true;
  // Value que tindra la questio
  @Input() value: string = '';
  // Value que sortira en el display en cas que possi un valor erroni per aixi no trencar
  temp_value: string = '';

  check: any = {};

  constructor(
    public validator: InputValidationService,
    public hdom: HdomService
  ) {}

  checkValid() {
    // Only perform temperature validation if there is a non-empty value
    if (this.temp_value !== null && this.temp_value !== '') {
      this.check = this.validator.isTemperature(this.temp_value);
    } else {
      // Treat empty value as invalid
      this.check = { valid: false };
    }

    if (this.check.valid) {
      // If valid, propagate the actual value
      this.inputValid.emit({ value: this.temp_value, valid: true });
    } else {
      // Emit an empty value and false for validity
      this.inputValid.emit({ value: '', valid: false });
    }
  }
}

type Lang = 'ca' | 'es' | 'en';
