import { Routes } from '@angular/router';

export const routes: Routes = [
  {
      path: 'atheneaform',
      loadComponent: () =>
        import('./pages/atheneaform-page/atheneaform-page.component').then(
          (m) => m.AtheneaformPageComponent
        ),
    },
];
