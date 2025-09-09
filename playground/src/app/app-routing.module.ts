import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home/:id',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'list-forms/:id',
    loadChildren: () => import('./pages/list-forms/list-forms.module').then( m => m.ListFormsPageModule)
  },
    {
    path: 'list-athenea-forms/:id',
    loadChildren: () => import('./pages/list-athenea-forms/list-athenea-forms.module').then( m => m.ListAtheneaFormsPageModule)
  },
  {
    path: 'confirm-email/:id',
    loadChildren: () => import('./pages/confirm-email/confirm-email.module').then( m => m.ConfirmEmailPageModule)
  },
  {
    path: 'list-forms/form/:id',
    loadChildren: () => import('./pages/list-forms/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: 'list-athenea-forms/view-forms/:id',
    loadChildren: () => import('./pages/list-athenea-forms/form/form.module').then( m => m.FormPageModule)
  },
  {
    path: '**',
    pathMatch: 'full',
    loadChildren: () => import('./pages/not-found/not-found.module').then( m => m.NotFoundPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
