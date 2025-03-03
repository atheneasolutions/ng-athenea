import { Component, OnInit } from '@angular/core';

import { HdomService } from '../../hdom/services/hdom.service';


@Component({
  selector: 'app-pulsioximeter',
  templateUrl: './pulsioximeter.Component.html',
  styleUrls: ['./pulsioximeter.Component.scss'],
})
export class PulsioximeterComponent implements OnInit {

  ngOnInit(): void {
    this.checkValid()
  }

  constructor(
    public hdom: HdomService,
  ) {  }
}

