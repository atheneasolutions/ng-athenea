import { Component, OnInit } from '@angular/core';

import { HdomService } from '../../hdom/services/hdom.service';

@Component({
  selector: 'app-scale',
  templateUrl: './scale.Component.html',
  styleUrls: ['../../hdom/hdom.Component.scss', './scale.Component.scss'],
})
export class ScaleComponent implements OnInit {

  ngOnInit(): void {
    this.checkValid()
  }

  constructor(
    public hdom: HdomService,
  ) {  }
}