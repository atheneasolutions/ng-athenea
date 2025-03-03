import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ScanComponent } from './scan/scan.component';



@NgModule({
        declarations: [
                ScanComponent
        ],
        imports: [
                FormsModule,
                CommonModule,
                IonicModule,
                RouterModule,
        ],
        exports: [
                ScanComponent
        ]
})
export class ScanComponentsModule { }
