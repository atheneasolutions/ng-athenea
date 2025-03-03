import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HdomService } from '../../services/hdom.service';
import { InputValidationService } from '../../services/input-validation.service';


@Component({
  selector: 'app-heart-rate-result',
  templateUrl: './heart-rate-result.component.html',
  styleUrls: ['../../styles/hdom.page.scss', '../../styles/scan.component.scss', './heart-rate-result.component.scss'],
})
export class HeartRateResultComponent implements OnInit {

  ngOnInit(): void {
    this.checkValid()
  }

  @Input() inputChange!: () => void;

  // Value que tindra la questio
  @Input() value: string = '';
  // Value que sortira en el display en cas que possi un valor erroni per aixi no trencar
  temp_value: string = '';
  
  check: any = {};


  constructor(public validator: InputValidationService,
    public hdom: HdomService) { }

  checkValid() {
    this.check = this.validator.isHeartRate(this.temp_value);
        if (this.check.valid) {
      this.value = this.temp_value
      @Input() inputChange!: () => void;

    }
  }
}