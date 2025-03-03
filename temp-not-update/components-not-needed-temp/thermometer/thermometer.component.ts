import { Component, OnInit } from '@angular/core';
import { HdomService } from '../../hdom/services/hdom.service';

@Component({
  selector: 'app-thermometer',
  templateUrl: './thermometer.Component.html',
  styleUrls: ['../../../emc.Component.scss', './thermometer.Component.scss'],
})
export class ThermometerComponent implements OnInit {

  ngOnInit(): void {
    this.checkValid()
  }

  constructor(
    public hdom: HdomService,
  ) {  }

}
