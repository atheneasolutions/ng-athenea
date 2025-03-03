import { Component, OnInit } from '@angular/core';

import { HdomService } from '../../hdom/services/hdom.service';


@Component({
  selector: 'app-glucometer',
  templateUrl: './glucometer.Component.html',
  styleUrls: ['../../styles/emc.Component.scss', './glucometer.Component.scss'],
})
export class GlucometerComponent implements OnInit {

  ngOnInit(): void {
    this.checkValid()
  }

  constructor(
    public hdom: HdomService,
  ) {   }

}
