import { Route } from '@angular/router';

export default [
  {
    path: 'form',
    loadChildren: () => import('./form/form-routing')
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list-routing.module')
  },
  {
    path: 'detail',
    loadChildren: () => import('./detail/detail-routing')
  },

  {
    path: 'personal',
    loadChildren: () => import('./personal/personal-routing')
  },
  {
    path: 'except',
    loadChildren: () => import('./except/except-routing')
  },
  {
    path: 'result',
    loadChildren: () => import('./result/result-routing')
  },
  {
    path: 'flow',
    loadChildren: () => import('./flow/flow-routing')
  },
  {
    path: 'task',
    title: 'Nhiệm vụ',
    data: { key: 'task' },
    loadComponent: () => import('./task/task.component').then(m => m.TaskComponent)
  },
  {
    path: 'page-demo1',
    title: 'Bố cục mới',
    data: { key: 'page-demo1' },
    loadComponent: () => import('./new-page-layout/new-page-layout.component').then(m => m.NewPageLayoutComponent)
  },
  {
    path: 'page-demo1',
    title: 'Bố cục mới',
    data: { key: 'page-demo1' },
    loadComponent: () => import('./new-page-layout/new-page-layout.component').then(m => m.NewPageLayoutComponent)
  },
  {
    path: 'page-demo2',
    title: 'Trang mới 2',
    data: { key: 'page-demo2' },
    loadComponent: () => import('../../pages/no-content/no-content.component').then(m => m.NoContentComponent)
  },
  {
    path: 'page-demo3',
    title: 'Trang mới 3',
    data: { key: 'page-demo3' },
    loadComponent: () => import('../../pages/no-content/no-content.component').then(m => m.NoContentComponent)
  },
  {
    path: 'page-demo4',
    title: 'Trang mới 4',
    data: { key: 'page-demo4' },
    loadComponent: () => import('../../pages/no-content/no-content.component').then(m => m.NoContentComponent)
  }
] satisfies Route[];
