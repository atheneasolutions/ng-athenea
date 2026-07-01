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
  selector: 'app-unit-result',
  templateUrl: './unit-result.component.html',
  styleUrls: [
    '../../styles/hdom.page.scss',
    '../../styles/scan.component.scss',
    './unit-result.component.scss',
  ],
})
export class UnitResultComponent implements OnInit, OnChanges {
  ngOnInit(): void {
    this.temp_value = this.value;
    this.checkValid();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.temp_value = changes['value'].currentValue;
      this.checkValid();
    }
  }

  @Output() inputValid = new EventEmitter<{
    value: string;
    valid: boolean;
  }>();
  @Input() selectedLang: Lang = 'ca';
  @Input() canAnswer: boolean = true;
  // Value que tindra la questio
  @Input() value: string = '';
  @Input() unitType: string = '';
  // Value que sortira en el display en cas que possi un valor erroni per aixi no trencar
  temp_value: string = '';

  check: any = {};

  constructor(
    public validator: InputValidationService,
    public hdom: HdomService
  ) {}

  checkValid() {
    this.check = this.validator.isWeight(this.temp_value);
    if (this.check.valid) {
      this.value = this.temp_value;
      this.inputValid.emit({ value: this.value, valid: true });
    } else {
      this.inputValid.emit({ value: '', valid: false });
    }
  }
}

type Lang = 'ca' | 'es' | 'en';
