import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListAtheneaFormsPageRoutingModule } from './list-athenea-forms-routing.module';

import { ListAtheneaFormsPage } from './list-athenea-forms.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { AtheneaformComponent } from '@atheneasolutions/swiper-form-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListAtheneaFormsPageRoutingModule,
    ComponentsModule,
    TranslateModule,
    AtheneaformComponent
  ],
  declarations: [ListAtheneaFormsPage]
})
export class ListAtheneaFormsPageModule {}
