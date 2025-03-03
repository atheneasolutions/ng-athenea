import { Component, OnInit } from '@angular/core';
import { HdomService } from '../../hdom/services/hdom.service';

@Component({
  selector: 'app-tensiometer',
  templateUrl: './tensiometer.Component.html',
  styleUrls: ['../../../emc.Component.scss', './tensiometer.Component.scss'],
})
export class TensiometerComponent implements OnInit {

  ngOnInit(): void {
    this.checkValid()
  }

  constructor(
    public hdom: HdomService,
  ) {  }
}