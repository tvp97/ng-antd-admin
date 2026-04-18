import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'dept', pathMatch: 'full' },
  { path: 'menu', title: 'Quản lý thực đơn', data: { key: 'menu' }, loadComponent: () => import('./menu/menu.component').then(m => m.MenuComponent) },
  { path: 'account', title: 'Quản lý tài khoản', data: { key: 'account' }, loadComponent: () => import('./account/account.component').then(m => m.AccountComponent) },
  { path: 'dept', title: 'Quản lý bộ phận', data: { key: 'dept' }, loadComponent: () => import('./dept/dept.component').then(m => m.DeptComponent) },
  { path: 'role-manager', loadChildren: () => import('./role-manager/role-manage-routing') }
] satisfies Route[];
