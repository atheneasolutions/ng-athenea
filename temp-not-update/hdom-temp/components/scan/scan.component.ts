import { Component, Input } from '@angular/core';
import { HdomService } from '../../services/hdom.service';


@Component({
  selector: 'app-scan-component',
  templateUrl: './scan.page.html',
  styleUrls: ['../../emc.page.scss', './scan.page.scss'],
})


export class ScanComponent {

  constructor(public hdom: HdomService) { }

  @Input() type: string = '';
  @Input() value: string | BloodPreasure | null = '';
  @Input() inputChange!: (value: string) => void;

  if()

  setValueAndUnlock(value: string) {
    this.inputChange(value);
  }
}

export interface BloodPreasure {
  sys_value: string;
  dia_value: string;
} 