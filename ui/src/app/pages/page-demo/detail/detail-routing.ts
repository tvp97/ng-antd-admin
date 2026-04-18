import { Route } from '@angular/router';
export default [
  { path: '', redirectTo: 'base-detail', pathMatch: 'full' },
  { path: 'base-detail', title: 'Cơ sởChi tiếttrang', data: { key: 'base-detail' }, loadComponent: () => import('./base-detail/base-detail.component').then(m => m.BaseDetailComponent) },
  { path: 'adv-detail', title: 'Cao cấpChi tiếttrang', data: { key: 'adv-detail' }, loadComponent: () => import('./adv-detail/adv-detail.component').then(m => m.AdvDetailComponent) }
] satisfies Route[];
