import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListFormsPageRoutingModule } from './list-forms-routing.module';

import { ListFormsPage } from './list-forms.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListFormsPageRoutingModule,
    ComponentsModule,
    TranslateModule
  ],
  declarations: [ListFormsPage]
})
export class ListFormsPageModule {}
