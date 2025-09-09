import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListAtheneaFormsPage } from './list-athenea-forms.page';

const routes: Routes = [
  {
    path: '',
    component: ListAtheneaFormsPage
  },
  {
    path: 'view-forms/:id',
    loadChildren: () => import('./form/form.module').then( m => m.FormPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListAtheneaFormsPageRoutingModule {}
