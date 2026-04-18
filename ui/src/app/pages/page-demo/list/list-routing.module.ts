import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'search-table', pathMatch: 'full' },
  { path: 'search-table', loadChildren: () => import('./search-table/search-table-routing') },
  { path: 'standard-table', title: 'Biểu mẫu tiêu chuẩn', data: { key: 'standard-table' }, loadComponent: () => import('./standard-table/standard-table.component').then(m => m.StandardTableComponent) },
  { path: 'tree-list', title: 'Bảng dạng cây', data: { key: 'tree-list' }, loadComponent: () => import('./tree-list/tree-list.component').then(m => m.TreeListComponent) },
  { path: 'card-table', title: 'Danh sách thẻ', data: { key: 'card-table' }, loadComponent: () => import('./card-table/card-table.component').then(m => m.CardTableComponent) },
  { path: 'search-list', loadChildren: () => import('./search-list/search-list-routing') }
] satisfies Route[];
