import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'transition', pathMatch: 'full' },
  { path: 'transition', title: 'Thành phần hoạt hình', data: { key: 'transition' }, loadComponent: () => import('./transition/transition.component').then(m => m.TransitionComponent) },
  { path: 'basic', title: 'Các thành phần cơ bản', data: { key: 'basic' }, loadComponent: () => import('./basic/basic.component').then(m => m.BasicComponent) },
  { path: 'lazy', loadChildren: () => import('./lazy/lazy-routing') },
  { path: 'luckysheet', title: 'Trực tuyếnexcel', data: { key: 'luckysheet' }, loadComponent: () => import('./luckysheet/luckysheet.component').then(m => m.LuckysheetComponent) },
  { path: 'desc', title: 'Chi tiếtThành phần', data: { key: 'desc' }, loadComponent: () => import('./desc/desc.component').then(m => m.DescComponent) },
  { path: 'strength-meter', title: 'Thành phần độ mạnh mật khẩu', data: { key: 'strength-meter' }, loadComponent: () => import('./strength-meter/strength-meter.component').then(m => m.StrengthMeterComponent) },
  { path: 'form', loadChildren: () => import('./form/form-routing') },
  {
    path: 'blingbling',
    title: 'blingbling',
    data: { key: 'blingbling' },
    loadComponent: () => import('../../pages/comp/blingbling/blingbling.component').then(m => m.BlingblingComponent)
  },
  {
    path: 'comp2',
    title: 'Thành phần mới2',
    data: { key: 'comp2' },
    loadComponent: () => import('../../pages/no-content/no-content.component').then(m => m.NoContentComponent)
  },
  {
    path: 'comp3',
    title: 'Thành phần mới3',
    data: { key: 'comp3' },
    loadComponent: () => import('../../pages/no-content/no-content.component').then(m => m.NoContentComponent)
  },
  {
    path: 'comp4',
    title: 'Thành phần mới4',
    data: { key: 'comp4' },
    loadComponent: () => import('../../pages/no-content/no-content.component').then(m => m.NoContentComponent)
  },
  {
    path: 'comp5',
    title: 'Thành phần mới5',
    data: { key: 'comp5' },
    loadComponent: () => import('../../pages/no-content/no-content.component').then(m => m.NoContentComponent)
  }
] satisfies Route[];
