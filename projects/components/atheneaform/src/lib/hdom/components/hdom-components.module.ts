import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BloodGlucoseResultComponent } from './blood-glucose-result/blood-glucose-result.component';
import { HeartRateResultComponent } from './heart-rate-result/heart-rate-result.component';
import { BloodPressureResultComponent } from './blood-pressure-result/blood-pressure-result.component';
import { ScaleResultComponent } from './scale-result/scale-result.component';
import { ThermometerResultComponent } from './thermometer-result/thermometer-result.component';
import { BloodPressureHeartRateResultComponent } from './blood-pressure-heart-rate/blood-pressure-heart-rate-result.component';
import { UnitResultComponent } from './unit-result/unit-result.component';

@NgModule({
        declarations: [
                BloodGlucoseResultComponent,
                HeartRateResultComponent,
                BloodPressureResultComponent,
                ScaleResultComponent,
                ThermometerResultComponent,
                BloodPressureHeartRateResultComponent,
                UnitResultComponent
        ],
        imports: [
                FormsModule,
                CommonModule,
                IonicModule,
                RouterModule,
        ],
        exports: [
                BloodGlucoseResultComponent,
                HeartRateResultComponent,
                BloodPressureResultComponent,
                ScaleResultComponent,
                ThermometerResultComponent,
                BloodPressureHeartRateResultComponent,
                UnitResultComponent
        ]
})
export class HdomComponentsModule { }
