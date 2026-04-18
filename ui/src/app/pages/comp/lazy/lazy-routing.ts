import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'lazy-basic', pathMatch: 'full' },
  { path: 'lazy-basic', title: 'Ví dụ cơ bản về tải chậm', data: { key: 'lazy-basic' }, loadComponent: () => import('./lazy-basic/lazy-basic.component').then(m => m.LazyBasicComponent) },
  { path: 'lazy-scroll', title: 'Tải lười cuộn', data: { key: 'lazy-scroll' }, loadComponent: () => import('./lazy-scroll/lazy-scroll.component').then(m => m.LazyScrollComponent) }
] satisfies Route[];
