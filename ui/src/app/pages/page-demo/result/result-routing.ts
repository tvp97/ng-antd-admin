import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'role-manage', pathMatch: 'full' },
  { path: 'success', title: 'Trang thành công', data: { key: 'success' }, loadComponent: () => import('./success/success.component').then(m => m.SuccessComponent) },
  { path: 'fail', title: 'Trang thất bại', data: { key: 'fail' }, loadComponent: () => import('./fail/fail.component').then(m => m.FailComponent) }
] satisfies Route[];
