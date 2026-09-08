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
  selector: 'app-oxygen-saturation-result',
  templateUrl: './oxygen-saturation-result.component.html',
  styleUrls: [
    '../../styles/hdom.page.scss',
    '../../styles/scan.component.scss',
    './oxygen-saturation-result.component.scss',
  ],
})
export class OxygenSaturationResultComponent implements OnInit, OnChanges {
  ngOnInit(): void {
    this.temp_value = this.value;

    queueMicrotask(() => {
      this.checkValid();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.temp_value =
        changes['value'].currentValue == null
          ? ''
          : String(changes['value'].currentValue);

      queueMicrotask(() => {
        this.checkValid();
      });
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
  // Value que sortira en el display en cas que possi un valor erroni per aixi no trencar
  temp_value: string = '';

  check: any = {};

  constructor(
    public validator: InputValidationService,
    public hdom: HdomService
  ) {}

  checkValid() {
    this.check = this.validator.isOxygenSat(this.temp_value);

    this.inputValid.emit({
      value: this.temp_value,
      valid: this.check.valid,
    });
  }
}

type Lang = 'ca' | 'es' | 'en';
